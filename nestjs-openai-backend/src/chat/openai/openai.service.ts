import { Injectable } from '@nestjs/common';
import OpenAi from 'openai';

@Injectable()
export class OpenaiService {
    private readonly openaiClient = new OpenAi({
        apiKey: process.env.OPENAI_API_KEY
    })

    async get_responses(prompt: string) {
        const response = await this.openaiClient.responses.create({
            model: 'gpt-4o-mini',
            input: [{ "role": "user", "content": prompt }],
            max_output_tokens: 100
        })

        const input_token_price = 0.05 / 1_000_000
        const output_token_price = 0.4 / 1_000_000

        const input_tokens = response.usage?.input_tokens || 0
        const output_tokens = response.usage?.output_tokens || 0

        const total = (input_tokens * input_token_price) + (output_tokens * output_token_price)
        console.log(`Total: ${total}$`)

        return response.output_text
    }

    async get_responses_with_context(prompt: string, userId: string) {
        console.log(userId)
        const context = [
            { "role": "system" as const, "content": "Eres un asistente virtual, si te insultan da respuestas como: Hey!, no deberias decir eso" },
            { "role": "system" as const, "content": "Como resumen, el usuario se llama reinaldo, tiene 28 años y vive en valdivia, su perfil es desarrollador backend con foco en ia" },
            { "role": "user" as const, "content": "Que tendencia hay actualmente" },
            { "role": "assistant" as const, "content": "Actualmente esta creciendo mucho las herramientas de inteligencia artificial como antigravity, que ayuda a los desarrolladores a ser mas productivos" }
        ]

        const messages = [...context, { "role": "user" as const, "content": prompt }]

        const response = await this.openaiClient.responses.create({
            model: 'gpt-4o-mini',
            input: messages,
            max_output_tokens: 100
        })

        const input_token_price = 0.05 / 1_000_000
        const output_token_price = 0.4 / 1_000_000

        const input_tokens = response.usage?.input_tokens || 0
        const output_tokens = response.usage?.output_tokens || 0

        const total = (input_tokens * input_token_price) + (output_tokens * output_token_price)
        console.log(`Total: ${total}$`)

        return response.output_text
    }

}
