FROM denoland/deno:1.27.0
COPY . ./
EXPOSE 8080
CMD ["deno", "task", "start"]