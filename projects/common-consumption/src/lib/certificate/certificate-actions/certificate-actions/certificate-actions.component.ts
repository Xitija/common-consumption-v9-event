import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface IPreviewActionButton {
  label: string;
  name: string;
  show: boolean;
}

export interface IPreviewActionButtonClick {
  event: MouseEvent;
  name: string;
}

@Component({
  selector: 'sb-certificate-actions',
  templateUrl: './certificate-actions.component.html',
  styleUrls: ['./certificate-actions.component.scss']
})

export class CertificateActionsComponent implements OnInit {
  @Input() select: IPreviewActionButton = { show: false, label: 'Select', name: 'select' };
  @Input() preview: IPreviewActionButton = { show: false, label: 'Preview', name: 'preview' };
  @Input() remove: IPreviewActionButton = { show: false, label: 'Remove', name: 'remove' };
  @Input() template: string;
  @Input() isSelectedTemplate = false;

  @Input() actionButtons: IPreviewActionButton[] = [];
  @Output() buttonClick = new EventEmitter<IPreviewActionButtonClick>();

  showOverlay = true;
  templateUrl: SafeResourceUrl | string = '';
  constructor(public domSanitizer: DomSanitizer) { }

  onButtonClick(event: MouseEvent, name: string) {

    if (name === 'select') {
      this.isSelectedTemplate = true;
      this.showOverlay = false;
    }
    this.buttonClick.emit({ event, name });
  }

  ngOnInit() {
    if (this.template) {
     this.templateUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.template);
    }
  }
}
