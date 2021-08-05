import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { TestComponent } from './test-component';

@injectable()
export class TestViewWidget extends ReactWidget {

    static readonly ID = 'test-home:widget';
    static readonly LABEL = 'Test: Home ';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = TestViewWidget.ID;
        this.title.label = TestViewWidget.LABEL;
        this.title.caption = TestViewWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    protected render(): React.ReactNode {
        return <TestComponent/>
    }

    protected displayMessage(): void {
        this.messageService.info('Congratulations: Test Component Widget Successfully Created!');
    }

}