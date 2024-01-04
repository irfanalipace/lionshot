
import { filterFiles } from '../utils/helpers';

const fileService = {
	maxSize:5,
	handleFileInputChange(event, allowedFiles, cb, maxSize=this.maxSize)  {
		event.preventDefault();
		const files = event.target.files
		this.fileFilteration(files,cb, allowedFiles, maxSize);
	},
	handleFileDrag (event, allowedFiles, cb, maxSize=this.maxSize) {
		event.preventDefault();
		const files = event.dataTransfer.files;		
		this.fileFilteration(files,cb, allowedFiles, maxSize);
	},
	handlePaste(event, allowedFiles, cb, maxSize=this.maxSize){
		event.preventDefault();
		const clipboardData = (event.clipboardData || window.clipboardData);
		const files = Array.from(clipboardData.files);
		this.fileFilteration(files,cb, allowedFiles, maxSize);
	},
	fileFilteration(files,cb, allowedFiles, maxSize) {
		if (files?.length > 0) {
			const { validFiles, errors } = filterFiles(files, allowedFiles, maxSize);
			cb(validFiles, errors);
		}
	}
};

export default fileService;