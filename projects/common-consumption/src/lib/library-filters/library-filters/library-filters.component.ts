import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LibraryFiltersLayout, IFilterItem, ISelectedFilter, TocMimeTypes } from './models';

@Component({
    selector: 'sb-library-filters',
    templateUrl: './library-filters.component.html',
    styleUrls: ['./library-filters.component.scss']
})

export class LibraryFiltersComponent implements OnChanges {

    @Input() list: string[];
    @Input() tocList;
    @Input() selectedItems: number[];
    @Input() layout: LibraryFiltersLayout;
    @Output() selectedFilter: EventEmitter<ISelectedFilter> = new EventEmitter<ISelectedFilter>();
    @Output() selectedMimeType: EventEmitter<any> = new EventEmitter();

    public TocMimeTypesMaster = [
        { name: 'all', value: ['all'] },
        {
          name: 'video', value: ['video/mp4', 'video/x-youtube', 'video/webm']
        },
        {
          name: 'docs', value: ['application/pdf', 'application/epub', 'application/msword']
        },
        {
          name: 'interactive',
          value: ['application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.h5p-archive', 'application/vnd.ekstep.html-archive'],
        },
        // { name: 'AUDIOS', value: MimeType.AUDIO, iconNormal: './assets/imgs/audio.svg', iconActive: './assets/imgs/audio-active.svg'},
      ];

    filterList: IFilterItem[];

    get LibraryFiltersLayout() { return LibraryFiltersLayout; }
    get TocMimeTypes() { return TocMimeTypes; }
    
    fetchCorrespondingTypes(input:String) {
        let type = '';
        switch (input) {
            case TocMimeTypes.ALL: type = TocMimeTypes.ALL;
                break;
            case TocMimeTypes.AUDIO: type = TocMimeTypes.AUDIO;
                break;
            case TocMimeTypes.COLLECTION: type = TocMimeTypes.COLLECTION;
                break;
            case TocMimeTypes.DOCS: type = TocMimeTypes.DOCS;
                break;
            case TocMimeTypes.INTERACTIVE: type = TocMimeTypes.INTERACTIVE;
                break;
            case TocMimeTypes.VIDEO: type = TocMimeTypes.VIDEO;
                break;
        }
        return type;
    }

    ngOnChanges(changes) {
        if (this.layout === LibraryFiltersLayout.ROUND_WITH_ICONS) {
            if (this.tocList) {
                this.filterList = this.tocList.map((item, index) => {
                    let type = this.fetchCorrespondingTypes(item.value);
                    if (this.selectedItems && this.selectedItems.includes(index)) {
                        return ({ text: item.text, selected: true, type: type });
                    } else if (!this.selectedItems && type === TocMimeTypes.ALL) {
                        return ({ text: item.text, selected: true, type: type });
                    } else {
                        return ({ text: item.text, selected: false, type: type });
                    }
                });
            } else if(this.list) {
                this.filterList = this.list.map((item, index) => {
                    let type = this.fetchCorrespondingTypes(item);
                    if (this.selectedItems && this.selectedItems.includes(index)) {
                        return ({ text: item, selected: true, type: type });
                    } else if (!this.selectedItems && item === TocMimeTypes.ALL) {
                        return ({ text: item, selected: true, type: type });
                    } else {
                        return ({ text: item, selected: false, type: type });
                    }
                });
            }
        } else {
            if (this.list) {
                this.filterList = this.list.map((item, index) => {
                    if (this.selectedItems && this.selectedItems.includes(index)) {
                        return ({ text: item, selected: true });
                    } else {
                        return ({ text: item, selected: false });
                    }
                });
            }
        }
    }

    selectPill(event: MouseEvent, index: number) {
        this.filterList = this.filterList.map(e => ({ ...e, selected: false }));

        try {
            this.filterList[index].selected = true;
            this.selectedFilter.emit({ event: event, data: { ...this.filterList[index], index } });

            // animation code
            let el: HTMLElement | null = document.getElementById('class' + index);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
            } else {
                setTimeout(() => {
                    el = document.getElementById('class' + index);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error in selectPill method', error);
        }
    }

    selectMimeFilter(event, index) {
       let outputType = {};
        this.filterList = this.filterList.map(e => ({ ...e, selected: false }));
        try {
            this.filterList[index].selected = true;
            this.TocMimeTypesMaster.map(mimeType => {
                if (mimeType.name === this.filterList[index].type) {
                    outputType = {
                        event: event,
                        data: {
                            value: mimeType.value,
                            ...this.filterList[index],
                            index,
                        }
                    };
                }
            });
            this.selectedMimeType.emit({...outputType});
            // animation code
            let el: HTMLElement | null = document.getElementById('mimeType' + index);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
            } else {
                setTimeout(() => {
                    el = document.getElementById('mimeType' + index);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
                    }
                }, 1000);
            }

        } catch (error) {
            console.error('Error in selectPill method', error);
        }
    }
}
