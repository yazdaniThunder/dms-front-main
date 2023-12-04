import { PropDocModel } from "./prop-doc.model";

export class DocumentModel {
    uuid: string;
    parent: string;
    context: string;
    path: string;
    author: string;
    created: string;
    name: string;
    scripting: boolean;
    thumbnails: any;
    thumbnailLink: string;
    properties: PropDocModel[];
    keywords: any;
    lastModified: any;
}
