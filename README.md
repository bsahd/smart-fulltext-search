# CLI Tool for smart fulltext search
# Usage
```sh
$ npx @bsahd/sgrep <path to directory> <file name pattern regex> <keywords...>
```
Example:
```sh
$ npx @bsahd/sgrep ~/Documents "^.+\.(txt|md)$" search keyword
```
if you're using pnpm/yarn/deno, please replace `npx @bsahd/sgrep` with `pnpx @bsahd/sgrep` , `yarn -s run @bsahd/sgrep` or `deno run npm:@bsahd/sgrep`.