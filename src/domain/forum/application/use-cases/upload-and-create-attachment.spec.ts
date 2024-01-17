import { FakeUploader } from 'test/storage/fake-uploader';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { Attachment } from '../../enterprise/entities/attachment';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and create attachment', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		fakeUploader = new FakeUploader();
		sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader);
	});

	it('should be able to upload and create an attachment', async () => {
		const fileName = 'profile.png';

		const result = await sut.execute({
			fileName,
			fileType: 'image/png',
			body: Buffer.from('')
		});
		
		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.attachments[0]
		});
		expect(fakeUploader.uploads).toHaveLength(1);
		expect(fakeUploader.uploads[0]).toEqual(
			expect.objectContaining({
				fileName
			})
		);
	});

	it('should not be able to upload an attachment with invalid fileType', async () => {
		const result = await sut.execute({
			fileName: 'profile.mp3',
			fileType: 'audio/mp3',
			body: Buffer.from('')
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
	});
});
