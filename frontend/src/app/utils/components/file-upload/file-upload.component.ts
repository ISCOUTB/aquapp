import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
  selectedFileName: string = null;
  error = false;
  @Input() showFileNameInput: boolean;
  @Input() uploadButtonText: string;
  @Input() property: string;
  @Input() format: string;
  @Input() icon: string;
  @Input() title: string;

  writeValue(value: any) {
    if (value !== undefined && value !== null) {
      this.propagateChange(value);
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}

  changeListener($event): void {
    // debugger; // uncomment this for debugging purposes
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    // debugger; // uncomment this for debugging purposes
    try {
      const file: File = inputValue.files[0];
      const myReader: FileReader = new FileReader();
      const writeValue = v => this.writeValue(v);
      myReader.onloadend = e => {
        this.error = false;
        this.selectedFileName = file.name;
        try {
          switch (this.format) {
            case 'JSON':
              writeValue(JSON.parse(myReader.result as string));
              break;
            default:
              writeValue(myReader.result);
              break;
          }
        } catch (error) {
          this.error = true;
        }
      };
      switch (this.format) {
        case 'JSON':
          myReader.readAsText(file);
          break;
        default:
          myReader.readAsDataURL(file);
          break;
      }
    } catch (error) {}
  }

  processFile() {}

  ngOnInit() {}
}
