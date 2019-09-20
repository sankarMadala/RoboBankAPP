import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUtil } from './file.util';
import { Constants } from './statement-processor.constants';
import * as $ from 'jquery';
@Component({
  selector: 'app-statement-processor',
  templateUrl: './statement-processor.component.html',
  styleUrls: ['./statement-processor.component.css']
})
export class StatementProcessorComponent implements OnInit {

  headersRow: any[];
  failedRecords: any[];
  @ViewChild('fileImportInput')
  fileImportInput: any;
  isRecordsAvailable = false;
  isFailedRecords = false;
  csvRecords = [];
  rowsPerPageList: Number[] = Constants.RowsPerPageList;
  defaultRowsPerPage: Number = Constants.DefaultRowsPerPage;

  constructor(public fileUtil: FileUtil
  ) { }

  ngOnInit() { }

  fileUploadListener($event): void {
    this.isFailedRecords = false;
    this.isRecordsAvailable = false;
    const text = [];
    const target = $event.target || $event.srcElement;
    const files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (this.fileUtil.isCSVFile(files[0])) {
        this.parseCSVFile($event);
      }
      if (this.fileUtil.isXMLFile(files[0])) {
        this.parseXMLFile($event);
      }
    }
  }

  parseXMLFile($event) {
    const input = $event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = (data) => {
      readXML(reader.result);
    };
    const readXML = (text) => {
      const finalRecords = [];
      const header = ['Reference', 'AccountNumber',	'Description'	, 'Start Balance', 'Mutation', 'End Balance'];
      finalRecords.push(header);
      const xmlDoc = $.parseXML(text),
        $xml = $(xmlDoc),
        $options = $xml.find('record');
      $.each($options, function (index) {
        const record = [];
        for (let i = 0; i < $(this).children().length; i++) {
          if (index === '0') {
            if (i === 0) {
              record.push($(this)[0].attributes[i].localName);
            }
            record.push($(this).children()[i].localName);
          } else {
            if (i === 0) {
              record.push($(this)[0].attributes[i].value);
            }
            record.push($(this).children()[i].innerHTML);
          }
        }
        console.log(record);
        finalRecords.push(record);
      });
      this.csvRecords = finalRecords;
      if (this.csvRecords == null) {
        this.fileReset();
      } else {
        this.isRecordsAvailable = true;
      }
    };
  }

  parseCSVFile($event) {
    const input = $event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = (data) => {
      const csvData = reader.result;
      const csvRecordsArray = csvData.split(/\r\n|\n/);
      let headerLength = -1;
      if (Constants.isHeaderPresentFlag) {
        const headersRow = this.fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
        headerLength = headersRow.length;
      }
      this.csvRecords = this.fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,
        headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
      if (this.csvRecords == null) {
        this.fileReset();
      } else {
        this.isRecordsAvailable = true;
      }
    };
    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  }

  findfailedRecords() {
    this.failedRecords = [];
    const header = ['References', 'Descripation', 'Error Message'];
    this.failedRecords.push(header);
    const referenceNumbers = [];
    this.csvRecords.forEach((record, index) => {
      referenceNumbers.push(record[0]);
    });
    const occurrences = referenceNumbers.reduce(function (occ, item) {
      occ[item] = (occ[item] || 0) + 1;
      return occ;
    }, {});

    console.log(occurrences);

    this.csvRecords.forEach((record, index) => {
      if (!(index === 0)) {
        let endValue = parseFloat(record[3]) + parseFloat(record[4]);
        endValue = (Math.round(endValue * 100) / 100);
        if (!(endValue === parseFloat(record[5]))) {
          const temp = [record[0], record[2], 'Invalid End Value' ];
          this.failedRecords.push(temp);
        } else if (occurrences[record[0]] > 1) {
          const temp = [record[0], record[2], 'Duplicate References No' ];
          this.failedRecords.push(temp);
        }
      }
    });
    this.isFailedRecords = this.failedRecords.length > 1 ? true : false;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = '';
    this.csvRecords = [];
    this.isFailedRecords = false;
    this.isRecordsAvailable = false;
  }
}


