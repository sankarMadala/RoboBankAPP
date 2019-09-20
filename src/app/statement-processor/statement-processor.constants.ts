import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    static tokenDelimeter = ',';
    static isHeaderPresentFlag = true;
    static validateHeaderAndRecordLengthFlag = true;
    static valildateFileExtenstionFlag = true;
    static RowsPerPageList = [5, 10, 15];
    static DefaultRowsPerPage = 5;
}
