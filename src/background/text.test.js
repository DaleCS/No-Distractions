import { formatInputURLToRegExp, formatRawURLToMatchPattern } from "./text";

describe("Testing formatInputURLToRegExp(inputURL)...", () => {
  const dummyCases = [
    {
      inputURL: "https://mangadex.org/",
      actualURL: "https://mangadex.org/",
      expected: true,
    },
    {
      inputURL: "https://mangadex.org/",
      actualURL: "https://mangadex.org/login/",
      expected: false,
    },
    {
      inputURL: "https://mangadex.org/*",
      actualURL: "https://mangadex.org/",
      expected: true,
    },
    {
      inputURL: "https://mangadex.org/*",
      actualURL: "https://mangadex.org/login/",
      expected: true,
    },
    {
      inputURL: "https://mangadex.org/",
      actualURL: "https://linkedin.com/in/dalecs/",
      expected: false,
    },
    {
      inputURL: "mangadex.org",
      actualURL: "https://mangadex.org/",
      expected: true,
    },
    {
      inputURL: "mangadex.org",
      actualURL: "https://mangadex.com/",
      expected: false,
    },
    {
      inputURL: "mangadex.org*",
      actualURL: "https://mangadex.org/",
      expected: true,
    },
    {
      inputURL: "mangadex.org*",
      actualURL: "https://mangadex.org/login",
      expected: true,
    },
    {
      inputURL: "mangadex.org*",
      actualURL: "https://mangadex.com/",
      expected: false,
    },
    {
      inputURL: "google.com/maps",
      actualURL: "https://google.com/maps/",
      expected: true,
    },
    {
      inputURL: "https://google.com/resource.html",
      actualURL: "https://google.com/resource.html",
      expected: true,
    },
    {
      inputURL: "https://google.com/resource.html",
      actualURL: "https://google.com/resource.hml",
      expected: false,
    },
    {
      inputURL: "https://google.com/*",
      actualURL: "https://google.com/resource.html",
      expected: true,
    },
    {
      inputURL: "https://drive.google.com/drive/my-drive",
      actualURL: "https://drive.google.com/drive/my-drive/",
      expected: true,
    },
    {
      inputURL: "https://drive.google.com/drive/my-drive",
      actualURL: "https://drive.google.com/drive/my-drive/a",
      expected: false,
    },
  ];

  dummyCases.forEach((testCase) => {
    const { inputURL, actualURL, expected } = testCase;
    test(`${
      expected
        ? "inputURL should MATCH actualURL"
        : "inputURL should NOT MATCH actualURL"
    }`, () => {
      const result = new RegExp(formatInputURLToRegExp(inputURL)).test(
        actualURL
      );
      expect(result).toBe(expected);
    });
  });
});

describe("Testing formatRawURLToMatchPattern(url)...", () => {
  const testCases = [
    "www.twitch.tv",
    "www.twitch.tv/",
    "www.twitch.tv/*",
    "www.twitch.tv*",
    "https://www.twitch.tv/*",
    "https://www.twitch.tv*",
    "https://www.twitch.tv/ichikamaia",
    "https://www.twitch.tv/ichikamaia/",
    "https://www.twitch.tv/ichikamaia/*",
    "https://www.twitch.tv/ichikamaia*",
  ];
  const expected = [
    "*://www.twitch.tv/",
    "*://www.twitch.tv/",
    "*://www.twitch.tv/*",
    "*://www.twitch.tv/*",
    "https://www.twitch.tv/*",
    "https://www.twitch.tv/*",
    "https://www.twitch.tv/ichikamaia",
    "https://www.twitch.tv/ichikamaia",
    "https://www.twitch.tv/ichikamaia/*",
    "https://www.twitch.tv/ichikamaia/*",
  ];

  const testCasesThrows = ["*", "*/", "*/*"];

  testCases.forEach((input, index) => {
    const result = formatRawURLToMatchPattern(input);
    test(`should match ${expected[index]}`, () => {
      expect(result).toBe(expected[index]);
    });
  });

  testCasesThrows.forEach((input) => {
    test(`${input} should throw`, () => {
      expect(() => {
        formatRawURLToMatchPattern(input);
      }).toThrow();
    });
  });
});
