import { MyFile } from "../../shared/file";
import { MoveResult } from "../../shared/move-result";
import { CreationDateStrategy } from "../../strategies/creation-date-strategy";
import { IOrderingStrategy } from "../../strategies/i-ordering-strategy";

import fs = require("fs");
import os = require("os");
import path = require("path");
import rimraf = require("rimraf");

describe("Ordering by creation date Tests", () => {

    let TMP_DIR = path.join(os.tmpdir(), "dosya-testing");
    const debug = true;
    const dryRun = true;

    beforeEach(() => {
        TMP_DIR = fs.mkdtempSync(TMP_DIR);
        const testFile = path.join(TMP_DIR, "test.json");
        fs.writeFileSync(testFile, "{}");
    });

    afterEach(() => {
        rimraf(TMP_DIR, () => {
            // ignore
        });
    });

    it("should not crash when given a non existing file", (done) => {
        const filename = "non_existing.json";
        const file: MyFile = new MyFile(filename, path.join(TMP_DIR, filename));
        const strategy = new CreationDateStrategy(TMP_DIR, debug, dryRun);
        strategy.run(file).then((result: MoveResult) => {
            fail();
            done();
        }).catch((error) => {
            done();
        });
    });

    it("should correctly determine destination path (no dry run)", (done) => {
        const filename = "test.json";
        const before = path.join(TMP_DIR, filename);
        const after = path.join(TMP_DIR, "2018", filename);
        const file: MyFile = new MyFile(filename, path.join(TMP_DIR, filename));
        const strategy = new CreationDateStrategy(TMP_DIR, debug, false);
        strategy.run(file).then((result: MoveResult) => {
            expect(result.moved).toBe(true);
            expect(result.before.absolutePath).toBe(before);
            expect(result.after.absolutePath).toBe(after);
            done();
        });
    });

    it("should correctly determine destination path (WITH dry run)", (done) => {
        const filename = "test.json";
        const before = path.join(TMP_DIR, filename);
        const after = path.join(TMP_DIR, "2018", filename);
        const file: MyFile = new MyFile(filename, path.join(TMP_DIR, filename));
        const strategy = new CreationDateStrategy(TMP_DIR, debug, dryRun);
        strategy.run(file).then((result: MoveResult) => {
            expect(result.moved).toBe(false);
            expect(result.before.absolutePath).toBe(before);
            expect(result.after.absolutePath).toBe(after);
            done();
        });
    });

});
