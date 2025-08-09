import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly qs;
    constructor(qs: QuestionsService);
    ask(question: string): Promise<string>;
}
