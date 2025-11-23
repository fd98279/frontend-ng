import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
    selector: 'numeric-cell',
    template: `<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%">`,
    standalone: false
})
export class NumericEditorComponent implements AfterViewInit {
    private params: any;
    public value: number;
    private cancelBeforeStart = false;

    @ViewChild('input', {static: false, read: ViewContainerRef}) public input;


    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;

        // only start edit if key pressed is a number, not a letter
        console.log(params.charPress);
        console.log(params.charPress && ('+-.1234567890'.indexOf(params.charPress) < 0));
        this.cancelBeforeStart = params.charPress && ('+-.1234567890'.indexOf(params.charPress) < 0);

    }

    getValue(): Number {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    // isCancelAfterEnd(): boolean {
    //     return this.value > 1000000;
    // }

    onKeyDown(event): void {
        if (!this.isKeyPressedNumeric(event)) {
            if (event.preventDefault) { event.preventDefault(); }
        }
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.input.element.nativeElement.focus();
        });
    }

    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which === 'undefined') ? event.keyCode : event.which;
    }

    private isCharFloat(charStr): boolean {
        return '+-.1234567890'.indexOf(charStr) > 0 || charStr === 'Backspace' || charStr === 'Home' || charStr === 'End';
    }

    private isKeyPressedNumeric(event): boolean {
        const charCode = this.getCharCodeFromEvent(event);
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        return this.isCharFloat(charStr);
    }
}
