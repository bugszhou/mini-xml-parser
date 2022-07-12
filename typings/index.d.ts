interface IConfig {
    isLowerCaseTag: boolean;
    useRootPath: boolean;
    sourceDir?: string;
    cwd?: string;
}
export declare function transform(xml: string): string;
export default function parse(source: string, dest: string, options: IConfig): void;
export {};
