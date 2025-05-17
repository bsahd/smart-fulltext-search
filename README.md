# CLI Tool for smart fulltext search
# Usage
```sh
$ npx @bsahd/sgrep@latest <path to directory> <file name pattern regex> <keywords...>
```
Example:
```sh
$ npx @bsahd/sgrep@latest ~/Documents "^.+\.(txt|md)$" search keyword
```
if you're using pnpm/yarn/deno, please replace `npx @bsahd/sgrep@latest` with `pnpx @bsahd/sgrep@latest` , `yarn -s run @bsahd/sgrep@latest` or `deno run npm:@bsahd/sgrep@latest`.