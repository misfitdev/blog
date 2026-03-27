# syntax=docker/dockerfile:1

# ── Stage 1: Gems ─────────────────────────────────────────────────────────────
# Cached until Gemfile or Gemfile.lock changes.
FROM ruby:3.3-alpine AS gems

RUN apk add --no-cache build-base libxml2-dev libxslt-dev

WORKDIR /gems
COPY Gemfile Gemfile.lock* ./
RUN bundle install --jobs "$(nproc)" --retry 3

# ── Stage 2: Jekyll build ──────────────────────────────────────────────────────
# Reruns only when source files change. Gems are reused from stage 1.
FROM ruby:3.3-alpine AS builder

RUN apk add --no-cache libxml2 libxslt

COPY --from=gems /usr/local/bundle /usr/local/bundle

WORKDIR /site
COPY . .
RUN bundle exec jekyll build --destination /dist

# ── Stage 3: Static file server ───────────────────────────────────────────────
# CGO_ENABLED=0 produces a fully static binary. Layer is cached permanently
# unless _docker/serve.go changes (i.e., never).
FROM golang:1.23-alpine AS server

WORKDIR /app
COPY _docker/serve.go main.go
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server main.go

# ── Stage 4: Distroless final ──────────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12

COPY --from=server /app/server /server
COPY --from=builder /dist /srv

EXPOSE 4000
ENTRYPOINT ["/server"]
