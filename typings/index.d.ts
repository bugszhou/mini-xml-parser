import { IElementMappings } from "./__interface__";
interface IConfig {
    isLowerCaseTag: boolean;
    useRootPath: boolean;
    elementMappings: IElementMappings;
    sourceDir?: string;
    cwd?: string;
}
export declare function transform(xml: string): string;
export default function parse(source: string, dest: string, options: IConfig): void;
export {};
