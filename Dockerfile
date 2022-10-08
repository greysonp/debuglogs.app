FROM denoland/deno:1.26.1
COPY . ./
EXPOSE 8080
CMD ["deno", "run", "-A", "index.ts"]