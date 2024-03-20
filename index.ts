import { processFile, testFiles } from "./modules/extract_pdf";

//uncomment to test files
(async () => {
  const data = await testFiles();
  console.log(data);
})();
