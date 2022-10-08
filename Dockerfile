FROM denoland/deno:1.26.1
COPY . ./
EXPOSE 8080
CMD ["bash", "run.sh"]