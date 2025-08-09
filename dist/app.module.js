"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const questions_controller_1 = require("./questions/questions.controller");
const documents_controller_1 = require("./documents/documents.controller");
const documents_service_1 = require("./documents/documents.service");
const questions_service_1 = require("./questions/questions.service");
const chroma_service_1 = require("./chroma/chroma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController, documents_controller_1.DocumentsController, questions_controller_1.QuestionsController],
        providers: [app_service_1.AppService, documents_service_1.DocumentsService, questions_service_1.QuestionsService, chroma_service_1.ChromaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map