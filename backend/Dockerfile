# 1. Image PHP 8.4 Alpine
FROM php:8.4-fpm-alpine

# 2. Installation des dépendances système indispensables
RUN apk add --no-cache \
    acl \
    fcgi \
    file \
    gettext \
    git \
    libzip-dev \
    zlib-dev \
    icu-dev \
    libpq-dev \
    bash

# 3. Installation et activation des extensions PHP
# On installe intl (pour Symfony), pdo_pgsql (pour PostgreSQL), opcache (performance)
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install -j$(nproc) \
        intl \
        pdo_pgsql \
        zip \
        opcache \
    && apk del .build-deps \
    && rm -rf /tmp/*

# Configuration indispensable pour les métriques
RUN echo "apc.enabled=1" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini \
    && echo "apc.enable_cli=1" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini

# 4. Récupération de Composer (via l'image officielle)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Définition du répertoire de travail
WORKDIR /var/www/html

# Ajoute ceci pour gérer les droits
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var/

# 6. Exposer le port 8000
EXPOSE 8000

# 7. Lancer le serveur interne de PHP sur le port 8000
# On écoute sur 0.0.0.0 pour être accessible depuis l'extérieur du container
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]