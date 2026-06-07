import { HttpException, Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/chat/openai/openai.service';

@Injectable()
export class ChatService {
    constructor(private readonly openaiServices: OpenaiService) { }

    async get_responses(prompt: string) {
        try {
            const response = await this.openaiServices.get_responses(prompt)
            return { response }
        } catch (error) {
            if (error.status === 429) throw new HttpException('Too many requests', 429)
            throw new Error('Internal server error')
        }
    }

    async get_responses_with_context(prompt: string, userId: string) {
        try {
            const response = await this.openaiServices.get_responses_with_context(prompt, userId)
            return { response }
        } catch (error) {
            if (error.status === 429) throw new HttpException('Too many requests', 429)
            throw new Error('Internal server error')
        }
    }
}
