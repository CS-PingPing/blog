// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const math = require("remark-math");
const katex = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "CS Ping Ping",
  tagline: "cs 공부 기록 저장소",
  url: "https://blog-cs-pingping.vercel.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  //organizationName: "facebook", // Usually your GitHub org/user name.
  //projectName: "docusaurus", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
            remarkPlugins: [math],
            rehypePlugins: [katex],
            showLastUpdateAuthor: true,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          // remarkPlugins: [math],
          // rehypePlugins: [katex],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "CS Ping Ping",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.png",
        },
        items: [
          // { to: "/blog", label: "Blog", position: "left" },
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Book",
          },
          {
            href: "https://github.com/CS-PingPing/blog",
            label: "GitHub",
            position: "left",
          },
        ],
        // },
        // footer: {
        //   style: "dark",
        //   links: [
        //     {
        //       title: "Docs",
        //       items: [
        //         {
        //           label: "Tutorial",
        //           to: "/docs/intro",
        //         },
        //       ],
        //     },
        //     {
        //       title: "Community",
        //       items: [
        //         {
        //           label: "Stack Overflow",
        //           href: "https://stackoverflow.com/questions/tagged/docusaurus",
        //         },
        //         {
        //           label: "Discord",
        //           href: "https://discordapp.com/invite/docusaurus",
        //         },
        //         {
        //           label: "Twitter",
        //           href: "https://twitter.com/docusaurus",
        //         },
        //       ],
        //     },
        //     {
        //       title: "More",
        //       items: [
        //         {
        //           label: "Blog",
        //           to: "/blog",
        //         },
        //         {
        //           label: "GitHub",
        //           href: "https://github.com/facebook/docusaurus",
        //         },
        //       ],
        //     },
        //   ],
        // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['csharp'],
      },
    }),
};

module.exports = config;
