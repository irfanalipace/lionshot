// ImportFileModal.tsx
import { FunctionComponent } from 'react';
import CustomDialog from '../Modal/Dialog';
import ImportFileBody from './importFIleBody';
import React from 'react';

interface ImportFileModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	close: any;
	importApi: (data: any) => Promise<void>; // Change the return type here
	ImportTypeEnum: Array<{ key: string; label: string; filePath: string }>;
}

const ImportFileModal: FunctionComponent<ImportFileModalProps> = ({
	isOpen,
	setIsOpen,
	importApi,
	close,
	ImportTypeEnum = [],
}) => {
	return (
		<CustomDialog open={isOpen} onClose={close} size='md' title={''}>
			{isOpen ? (
				<ImportFileBody
					onClose={close}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					importApi={importApi}
					ImportTypeEnum={ImportTypeEnum}
					callBack={() => {
						// Your callback logic here
					}}
					sampleCSV='your-sample-csv-file-path.csv'
					sampleXLS='your-sample-xls-file-path.xls'
				/>
			) : (
				<></>
			)}
		</CustomDialog>
	);
};

export default ImportFileModal;
