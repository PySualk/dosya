import { MyFile } from "../../shared/file";
import { RegexStrategy } from "../../strategies/regex-strategy";

import fs = require("fs");
import os = require("os");
import path = require("path");
import rimraf = require("rimraf");

describe("Ordering by mapping file Tests", () => {

    let TMP_DIR: string;
    let MAPPING_FILE: string;
    let TEST_FILE: string;

    beforeEach(() => {
        TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "dosya-testing-regex"));
        TEST_FILE = path.join(TMP_DIR, "foobar.jpg");
        fs.writeFileSync(TEST_FILE, "{}");
        MAPPING_FILE = path.join(TMP_DIR, "mapping.json");
        fs.writeFileSync(MAPPING_FILE, "[{\"regex\":\".(gif|jpg|jpeg|tiff|png)\",\"destination\": \"images/\"}]");

    });

    afterEach(() => {
        rimraf(TMP_DIR, () => {
            // ignore
        });
    });

    it("should corretly move a file", (done) => {
        const before = path.join(TMP_DIR, path.basename(TEST_FILE));
        const after = path.join(TMP_DIR, "images", path.basename(TEST_FILE));
        const debug = true;
        const dryRun = false;
        const regexStrategy: RegexStrategy = new RegexStrategy(TMP_DIR, debug, dryRun, MAPPING_FILE);
        const file: MyFile = new MyFile(path.basename(TEST_FILE), TEST_FILE);
        regexStrategy.run(file).then((result) => {
            expect(result.moved).toBe(true);
            expect(result.before.absolutePath).toBe(before);
            expect(result.after.absolutePath).toBe(after);
            expect(() => fs.statSync(result.before.absolutePath)).toThrowError("no such file or directory");
            expect( fs.statSync(result.after.absolutePath).isFile()).toBe(true);
            done();
        });
    });

    xit("should abort when no mapping file is available", () => {
        // todo
    });
});
