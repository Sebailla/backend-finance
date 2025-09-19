import { ArgumentMetadata, BadRequestException, Injectable, ParseUUIDPipe} from '@nestjs/common';

@Injectable()
export class IdValidationPipe extends ParseUUIDPipe {
  constructor(){
    super({
      exceptionFactory: () => new BadRequestException('Invalid ID')
    })
  }
}
