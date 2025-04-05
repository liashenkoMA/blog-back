import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('images')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

          cb(null, newFileName);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image|jpeg|png' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const filePath = {
      filePath: `${process.env.URL_UPLOADIMG}/images/upload/${file.filename}`,
    };
    return filePath;
  }

  @Get('upload/:filename')
  getImages(@Param('filename') filename, @Res() res) {
    res.sendFile(filename, { root: './uploads' });
  }
}
