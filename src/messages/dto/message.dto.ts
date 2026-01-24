import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty({
        description: 'The ID of the recipient user',
        example: 'clx1234567890abcdefgh',
    })
    @IsString()
    @IsNotEmpty()
    recipientId: string;

    @ApiProperty({
        description: 'The content of the message',
        example: 'Hello, how are you?',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'Optional conversation ID if replying to an existing conversation',
        example: 'clx0987654321zyxwvuts',
        required: false,
    })
    @IsString()
    @IsOptional()
    conversationId?: string;
}
