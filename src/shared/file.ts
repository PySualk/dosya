export class MyFile {
    constructor(
        // e.g. MyFile.doc
        public name: string,
        // e.g. /home/user/MyFile.doc
        public absolutePath: string,
        public createdAt?: number,
    ) { }

    public toString = (): string => {
        return `MyFile (name: ${this.name}, absolutePath: ${this.absolutePath}, createdAt: ${this.createdAt})`;
    }
}
