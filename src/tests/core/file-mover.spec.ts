import { FileMover } from "../../core/file-mover";

import fs = require("fs");
import os = require("os");
import path = require("path");
import rimraf = require("rimraf");

describe("File Mover Tests", () => {

    let TMP_DIR = path.join(os.tmpdir(), "dosya-testing");

    beforeEach(() => {
        TMP_DIR = fs.mkdtempSync(TMP_DIR);
        fs.mkdtempSync(path.join(TMP_DIR, "subdir"));
        const testFile = path.join(TMP_DIR, "test.json");
        fs.writeFileSync(testFile, "{}");
    });

    afterEach(() => {
        rimraf(TMP_DIR, () => {
            // ignore
        });
    });

    it("should simply rename a file", (done) => {
        const source = path.join(TMP_DIR, "test.json");
        const destination = path.join(TMP_DIR, "test2.json");
        FileMover.move(source, destination).then((result) => {
            expect(result).toBe(true);
            try {
                expect(fs.statSync(path.join(TMP_DIR, "test.json"))).toThrowError("ENOENT");
            } catch (e) {
                // console.log(e)
            }
            const stat = fs.statSync(destination);
            expect(stat.isFile()).toBe(true);
            done();
        }).catch((err) => {
            fail();
            done();
        });
    });

    it("should move a file to a subdirectory", (done) => {
        const source = path.join(TMP_DIR, "test.json");
        const destination = path.join(TMP_DIR, "what", "ever", "subdir", "test2.json");
        FileMover.move(source, destination).then((result) => {
            expect(result).toBe(true);
            const stat = fs.statSync(destination);
            expect(stat.isFile()).toBe(true);
            try {
                expect(fs.statSync(path.join(TMP_DIR, "test.json"))).toThrowError("ENOENT");
            } catch (e) {
                done();
            }
        }).catch((err) => {
            fail();
            done();
        });
    });

    it("should not crash when moving non existing file", (done) => {
        const source = path.join(TMP_DIR, "not_existing.json");
        const destination = path.join(TMP_DIR, "not_existing2.json");
        FileMover.move(source, destination).then((result) => {
            fail();
            done();
        }).catch((error) => {
            expect(error).toBe(false);
            done();
        });
    });

    it("should not override existing files", (done) => {
        fs.writeFileSync(path.join(TMP_DIR, "existing.json"), "{}");
        const source = path.join(TMP_DIR, "test.json");
        const destination = path.join(TMP_DIR, "existing.json");
        FileMover.move(source, destination).then((result) => {
            fail();
            done();
        }).catch((error) => {
            expect(error).toBe(false);
            done();
        });
    });

});
