import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatServices: ChatService) { }

    @Post('/')
    get_responses(@Body() chatDto: ChatDto) {
        return this.chatServices.get_responses(chatDto.prompt)
    }

    @Post(':userId')
    get_responses_with_context(@Body() chatDto: ChatDto, @Param('userId') userId: string) {
        return this.chatServices.get_responses_with_context(chatDto.prompt, userId)
    }
}
