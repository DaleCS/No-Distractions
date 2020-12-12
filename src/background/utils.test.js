import { formatInputURLToRegExp, getArrayOfURLRegExp } from "./text";

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

describe("Testing getArrayOfURLRegExps(list)", () => {
  const case1 = {
    list: [
      {
        inputURL: "https://www.reddit.com/*",
        regExp: "^(https:\\/\\/www\\.reddit\\.com\\/.*\\/{0,1})$",
        matchPattern: "https://www.reddit.com/*",
      },
      {
        inputURL: "https://www.facebook.com/*",
        regExp: "^(https:\\/\\/www\\.facebook\\.com\\/.*\\/{0,1})$",
        matchPattern: "https://www.facebook.com/*",
      },
      {
        inputURL: "https://mangadex.org/*",
        regExp: "^(https:\\/\\/mangadex\\.org\\/.*\\/{0,1})$",
        matchPattern: "https://mangadex.org/*",
      },
      {
        inputURL: "https://www.instagram.com/*",
        regExp: "^(https:\\/\\/www\\.instagram\\.com\\/.*\\/{0,1})$",
        matchPattern: "https://www.instagram.com/*",
      },
      {
        inputURL: "https://www.netflix.com/*",
        regExp: "^(https:\\/\\/www\\.netflix\\.com\\/.*\\/{0,1})$",
        matchPattern: "https://www.netflix.com/*",
      },
      {
        inputURL: "https://www.youtube.com/*",
        regExp: "^(https:\\/\\/www\\.youtube\\.com\\/.*\\/{0,1})$",
        matchPattern: "https://www.youtube.com/*",
      },
      {
        inputURL: "https://twitter.com/*",
        regExp: "^(https:\\/\\/twitter\\.com\\/.*\\/{0,1})$",
        matchPattern: "https://twitter.com/*",
      },
    ],
    expected: [
      {
        urlMatches: "^(https:\\/\\/www\\.reddit\\.com\\/.*\\/{0,1})$",
      },
      {
        urlMatches: "^(https:\\/\\/www\\.facebook\\.com\\/.*\\/{0,1})$",
      },
      {
        urlMatches: "^(https:\\/\\/mangadex\\.org\\/.*\\/{0,1})$",
      },
      {
        urlMatches: "^(https:\\/\\/www\\.instagram\\.com\\/.*\\/{0,1})$",
      },
      {
        urlMatches: "^(https:\\/\\/www\\.netflix\\.com\\/.*\\/{0,1})$",
      },
      {
        urlMatches: "^(https:\\/\\/www\\.youtube\\.com\\/.*\\/{0,1})$",
      },
      {
        urlMatches: "^(https:\\/\\/twitter\\.com\\/.*\\/{0,1})$",
      },
    ],
  };

  const case2 = {
    list: [
      {
        inputURL: "",
        matchPattern: "",
      },
      {},
      undefined,
      null,
    ],
  };

  const case3 = {
    list: [{}],
  };

  const case4 = {
    list: undefined,
  };

  const case5 = {
    list: [undefined],
  };

  const case6 = {
    list: null,
  };

  const case7 = {
    list: [null],
  };

  test("Should return array of events.UrlFilters", () => {
    const result = getArrayOfURLRegExp(case1.list);
    expect(result).toStrictEqual(case1.expected);
  });

  test("Should throw an error", () => {
    expect(() => {
      getArrayOfURLRegExp(case2.list);
    }).toThrow();
  });
  test("Should throw an error", () => {
    expect(() => {
      getArrayOfURLRegExp(case3.list);
    }).toThrow();
  });
  test("Should throw an error", () => {
    expect(() => {
      getArrayOfURLRegExp(case4.list);
    }).toThrow();
  });
  test("Should throw an error", () => {
    expect(() => {
      getArrayOfURLRegExp(case5.list);
    }).toThrow();
  });
  test("Should throw an error", () => {
    expect(() => {
      getArrayOfURLRegExp(case6.list);
    }).toThrow();
  });
  test("Should throw an error", () => {
    expect(() => {
      getArrayOfURLRegExp(case7.list);
    }).toThrow();
  });
});
