import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, prompt, count, referenceImages, image, ratio, artDirection } = body;
        const targetCount = count || 1;

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey || apiKey === "your_gemini_api_key_here") {
            return NextResponse.json(
                { error: "Google Gemini API Key not configured in .env. Please add AIza... key." },
                { status: 500 }
            );
        }

        // --- Action: ANALYZE ---
        if (action === 'analyze') {
            const { product, goal, image } = body;

            let systemPrompt = "Suggest art direction for this commercial project. Return ONLY a JSON with keys: style, lighting, texture, framing, mood, colors, audience. Concise values.";

            if (product || goal) {
                systemPrompt += "\n\nCONTEXT:";
                if (product) systemPrompt += `\nProduct Category: ${product.category}\nProduct Detail: ${product.detail}`;
                if (goal) systemPrompt += `\nCampaign Objective: ${goal.objective}\nTarget Audience: ${goal.target}`;
                systemPrompt += "\n\nTask: Tailor the art direction specifically to this product and target. Do NOT use generic placeholders.";
            }

            const parts: any[] = [{ text: systemPrompt }];

            if (image && image.includes("base64,")) {
                const base64Data = image.split("base64,")[1];
                parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts }],
                        generationConfig: { responseMimeType: "application/json" }
                    }),
                }
            );

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            return NextResponse.json({ analysis: JSON.parse(text || "{}") });
        }

        console.log(`Nano Banana Engine: Inbound Request (Count: ${targetCount}, Ratio: ${ratio || '3:4'})`);

        // --- Context-Aware Scenario Generation (lightweight, text-only, with timeout) ---
        let scenarios: string[] = [];

        try {
            const suggestedScenarios = await generateScenarios(prompt, targetCount, apiKey, artDirection, referenceImages);
            if (suggestedScenarios && Array.isArray(suggestedScenarios) && suggestedScenarios.length > 0) {
                scenarios = suggestedScenarios;
                console.log("Nano Banana Engine: Using Dynamic Scenarios:", scenarios.map(s => s.substring(0, 60)));
            }
        } catch (e) {
            console.warn("Nano Banana Engine: Scenario generation failed.");
        }

        // Image-capable models only, in order of preference
        const modelsToTry = [
            "gemini-2.5-flash-image",
            "gemini-2.0-flash-exp-image-generation",
            "imagen-3.0-generate-001",
        ];

        // Parallelize image generation to prevent timeouts
        const generationTasks = Array.from({ length: targetCount }).map(async (_, i) => {
            let lastError = "";
            for (const modelId of modelsToTry) {
                try {
                    // Inject chosen scenario
                    const scenario = scenarios.length > 0 ? scenarios[i % scenarios.length] : "";
                    const scenarioNameMatch = scenario.match(/\[SCENARIO: (.*?)\]/);
                    const scenarioName = scenarioNameMatch ? scenarioNameMatch[1] : "CAMPAIGN";

                    const seed = Math.random().toString(36).substring(7);
                    const assetCount = Array.isArray(referenceImages) ? referenceImages.length : 0;
                    const assetPlural = assetCount > 1 ? "multiple assets" : "the asset";
                    const assetList = assetCount > 1 ? Array.from({ length: assetCount }, (_, k) => `[ASSET ${k + 1}]`).join(", ") : "[ASSET 1]";

                    const parts: any[] = [{ text: `BASE PROMPT: ${prompt}. ${scenario}. ASPECT RATIO: ${ratio || '3:4'}. RANDOM SEED: ${seed}. TASK: Render the product using ${assetPlural} (${assetList}) into this specific scenario. ABSOLUTE PRODUCT INTEGRITY: The product is a FROZEN GEOMETRY. Direct rendering only. Do NOT re-type, re-draw, or interpret any text, fonts, or branding on the box/label. Replicate the reference exactly with zero deformation of visual details.` }];

                    // Handle multiple reference images (logos)
                    if (Array.isArray(referenceImages)) {
                        referenceImages.forEach((imgBase64: string, idx: number) => {
                            if (imgBase64 && imgBase64.includes("base64,")) {
                                const [mimePart, dataPart] = imgBase64.split("base64,");
                                const mimeType = mimePart.replace("data:", "").replace(";", "");
                                parts.push({ text: `[ASSET ${idx + 1}]:` });
                                parts.push({
                                    inline_data: {
                                        mime_type: mimeType || "image/jpeg",
                                        data: dataPart
                                    }
                                });
                            }
                        });
                    }

                    // Final Safety Directive
                    parts.push({ text: `FINAL DIRECTIVE: FROZEN TEXT & GEOMETRY. Use ${assetList} as the ONLY source of truth for branding. Replicate all text with 100% precision. RADICAL REALISM: Documentary photography style. Skin must have texture and details with visible pores and natural imperfections. NO glossy highlights, NO airbrushed smoothness, NO plastic textures. Maintain absolute product fidelity for all surfaces.` });

                    const requestBody: any = {
                        contents: [{ parts }],
                        generation_config: {
                            response_modalities: ["TEXT", "IMAGE"],
                        }
                    };

                    // Add aspect ratio only if model supports it (Gemini 2.5+ or Imagen)
                    if (modelId !== "gemini-2.0-flash-exp-image-generation") {
                        if (modelId.startsWith("imagen")) {
                            requestBody.generation_config = {
                                candidate_count: 1,
                                aspect_ratio: ratio || "1:1"
                            };
                        } else {
                            // Gemini 2.5 Flash Image uses image_config
                            requestBody.generation_config.image_config = {
                                aspect_ratio: ratio || "1:1"
                            };
                        }
                    }

                    console.log(`  → Variation ${i + 1}: trying ${modelId} (ratio: ${ratio || '1:1'})...`);

                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(requestBody),
                            signal: AbortSignal.timeout(90000) // 90s per attempt
                        }
                    );

                    if (!response.ok) {
                        const error = await response.json();
                        lastError = error.error?.message || `HTTP ${response.status}`;
                        console.warn(`  ✗ ${modelId} variation ${i + 1}: ${lastError}`);
                        continue;
                    }

                    const data = await response.json();
                    const imagePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData || p.inline_data);
                    const inlineData = imagePart?.inlineData || imagePart?.inline_data;

                    if (inlineData) {
                        console.log(`  ✓ ${modelId} variation ${i + 1}: SUCCESS`);
                        return {
                            url: `data:${inlineData.mimeType || inlineData.mime_type};base64,${inlineData.data}`,
                            id: `${modelId}-${i}`,
                            scenarioName: scenarioName
                        };
                    } else {
                        lastError = "No image data in response";
                        console.warn(`  ✗ ${modelId} variation ${i + 1}: response had no image data`);
                    }
                } catch (e: any) {
                    lastError = e.message;
                    console.warn(`  ✗ ${modelId} variation ${i + 1}: ${e.message}`);
                }
            }
            return null; // Failed all models for this specific variation
        });

        const results = await Promise.all(generationTasks);
        const allGeneratedImages = results.filter(Boolean);

        if (allGeneratedImages.length > 0) {
            console.log(`Nano Banana Engine: Success! Generated ${allGeneratedImages.length}/${targetCount} images.`);
            return NextResponse.json({ images: allGeneratedImages });
        }

        throw new Error("Nano Banana Engine exhausted all model paths. No images generated.");

    } catch (error: any) {
        console.error("Critical Engine Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate images" },
            { status: 500 }
        );
    }
}

async function generateScenarios(prompt: string, count: number, apiKey: string, artDirection?: any, referenceImages?: string[]) {
    try {
        let artContext = "";
        if (artDirection) {
            const parts = [];
            if (artDirection.style) parts.push(`Visual Style: ${artDirection.style}`);
            if (artDirection.colors) parts.push(`Color Palette: ${artDirection.colors}`);
            if (artDirection.lighting) parts.push(`Lighting: ${artDirection.lighting}`);
            if (artDirection.texture) parts.push(`Materials: ${artDirection.texture}`);
            if (artDirection.framing) parts.push(`Framing: ${artDirection.framing}`);
            if (artDirection.mood) parts.push(`Mood: ${artDirection.mood}`);
            if (parts.length > 0) {
                artContext = `\n\nART DIRECTION (MUST FOLLOW):\n${parts.join("\n")}\nAll scenarios MUST incorporate these art direction constraints. Match the specified style, lighting, and mood exactly.`;
            }
        }

        const parts: any[] = [{
            text: `You are a high-end creative director. Analyze the provided product/reference assets and the prompt.
Then, suggest ${count} diverse and highly realistic commercial photography scenarios that would best suit this specific product.

PRODUCT/PROMPT: ${prompt}${artContext}

RULES:
1. ANALYSIS: Look at the product in the reference images. Determine its materials, brand vibe, and category. 
2. ENVIRONMENT: Create environments that feel native to this specific product. If it's a luxury watch, think high-end lounges. If it's a rough hiking boot, think mountain trails.
3. CREATIVITY: Do NOT use generic studio backgrounds for all. One can be studio, others should be "in the wild" or "lifestyle".
4. DIVERSITY: Ensure each of the ${count} scenarios is distinct in lighting, color, and location.
5. FORMAT: Return each as "[SCENARIO: SHORT_NAME] - one line description of setting, lighting, mood."
6. Return ONLY a JSON array of strings.`
        }];

        // Add reference images for visual analysis
        if (Array.isArray(referenceImages)) {
            referenceImages.forEach((imgBase64) => {
                if (imgBase64 && imgBase64.includes("base64,")) {
                    const [mimePart, dataPart] = imgBase64.split("base64,");
                    const mimeType = mimePart.replace("data:", "").replace(";", "");
                    parts.push({
                        inline_data: {
                            mime_type: mimeType || "image/jpeg",
                            data: dataPart
                        }
                    });
                }
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: { responseMimeType: "application/json" }
                }),
                signal: AbortSignal.timeout(15000) // 15s for deeper analysis
            }
        );
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(text || "[]");
    } catch (e: any) {
        console.warn("Scenario generation skipped (timeout or error):", e.message);
        return null;
    }
}
