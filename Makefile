# Makefile
SHELL := /bin/bash

export IMAGE_VERSION=''
export ANGULAR_VERSION=18

cd-frontend-ng-dir:
	cd ${FRONTEND-NG-DIR}

install:  ## install npm pacakges
	export NODE_OPTIONS=--max_old_space_size=8048
	rm -rf /workspace/node_modules || true
	rm /workspace/node_modules/.ngcc_lock_file || true
	npm cache clean --force
	npm cache verify	
	npm install --force
	
install-update: install  ## install npm pacakges
	export NODE_OPTIONS=--max_old_space_size=8048
	rm -rf /workspace/node_modules || true
	# Upgrade to 1 higher version at a time
	# Shows what needs to update
	ng update
	# Upgrades everything including angular core
	ng update @infragistics/igniteui-angular@$(ANGULAR_VERSION) --force
	# Should already be upgraded but retry
	ng update @angular/core@$(ANGULAR_VERSION) --force
	# Upgrades angular cli
	ng update @angular/cli@$(ANGULAR_VERSION) --force
	# Upgrade charts
	ng update igniteui-angular-charts@$(ANGULAR_VERSION) --force
	ng update igniteui-angular-guages@$(ANGULAR_VERSION) --force
	ng update igniteui-angular-maps@$(ANGULAR_VERSION) --force

run:  install ## Called from within docker container. If need to perform npm update change install target to install-update
	export NODE_OPTIONS=--max_old_space_size=8048
	ng serve --host 0.0.0.0 --disable-host-check

build: cd-frontend-ng-dir
	if [ -d $(CURDIR)/../docker_volume/frontend-ng/$(environment) ]; then \
		mv $(CURDIR)/../docker_volume/frontend-ng/$(environment)-gzip $(CURDIR)/../docker_volume/frontend-ng/$(environment)-gzip_$(RUN_TIMESTAMP); \
		mv $(CURDIR)/../docker_volume/frontend-ng/$(environment) $(CURDIR)/../docker_volume/frontend-ng/$(environment)_$(RUN_TIMESTAMP); \
		mkdir -p $(CURDIR)/../docker_volume/frontend-ng/$(environment)-gzip; \
		mkdir -p $(CURDIR)/../docker_volume/frontend-ng/$(environment); \
	fi
	if [ -z "${environment}" ]; then echo "environment varaibles $(environment) is required"; exit 1; fi
	echo "Running $(environment) build";
	if [ "local" == "$(environment)" ]; then \
		docker run --rm  NODE_OPTIONS=--max_old_space_size=8048 \
		-v $(CURDIR)/../:/workspace -v $(CURDIR):/pwd \
		-v $(CURDIR)/../docker_volume/frontend-ng:/dist \
		public.ecr.aws/b8h3z2a1/sravz/frontend-ng:$(FRONTEND_NG_IMAGE_Version) sh -c "cd /pwd;make install;ng build --configuration=$(environment) --output-path=/dist/$(environment)/;npm run gzip --outputdir=/dist/$(environment)"; \
	else \
		if [ "staging" == "$(environment)" ]; then \
			docker run --rm  -e NODE_OPTIONS=--max_old_space_size=8048 \
			-v $(CURDIR)/../:/workspace -v $(CURDIR):/pwd \
			-v $(HOME)/.npmrc:/root/.npmrc \
			-v $(CURDIR)/../docker_volume/frontend-ng:/dist public.ecr.aws/b8h3z2a1/sravz/frontend-ng:$(FRONTEND_NG_IMAGE_Version) sh -c "cd /pwd;make install; \
			ng build --configuration=$(environment) --output-path=/dist/$(environment)/  --deploy-url=https://sravz-$(environment).s3.amazonaws.com/$(FRONTEND_NG_IMAGE_BIN_Staging_Version)/;npm \
			run gzip --outputdir=/dist/$(environment)"; \
		elif [ "production" == "$(environment)" ]; then \
			docker run --rm  -e NODE_OPTIONS=--max_old_space_size=8048 \
			-v $(CURDIR)/../:/workspace -v $(CURDIR):/pwd \
			-v $(HOME)/.npmrc:/root/.npmrc \
			-v $(CURDIR)/../docker_volume/frontend-ng:/dist public.ecr.aws/b8h3z2a1/sravz/frontend-ng:$(FRONTEND_NG_IMAGE_Version) sh -c "cd /pwd;make install; \
			ng build --configuration=$(environment) --output-path=/dist/$(environment)/ --deploy-url=https://sravz-$(environment).s3.amazonaws.com/$(FRONTEND_NG_IMAGE_BIN_Production_Version)/;npm \
			run gzip --outputdir=/dist/$(environment)"; \
		fi \
	fi

build-local: cd-frontend-ng-dir ## Build on local machine. Docker not used
	if [ -d $(CURDIR)/../docker_volume/frontend-ng/$(environment) ]; then \
		mv $(CURDIR)/../docker_volume/frontend-ng/$(environment)-gzip $(CURDIR)/../docker_volume/frontend-ng/$(environment)-gzip_$(RUN_TIMESTAMP); \
		mv $(CURDIR)/../docker_volume/frontend-ng/$(environment) $(CURDIR)/../docker_volume/frontend-ng/$(environment)_$(RUN_TIMESTAMP); \
		mkdir -p $(CURDIR)/../docker_volume/frontend-ng/$(environment)-gzip; \
		mkdir -p $(CURDIR)/../docker_volume/frontend-ng/$(environment); \
	fi
	if [ -z "${environment}" ]; then echo "environment varaibles $(environment) is required"; exit 1; fi
	echo "Running $(environment) build";
	if [ "local" == "$(environment)" ]; then \
		ng build --configuration=$(environment) --output-path=$(CURDIR)/../docker_volume/frontend-ng/$(environment)/; \
		npm run gzip --outputdir=$(CURDIR)/../docker_volume/frontend-ng/$(environment)";
	else \
		make install;ng build --configuration=$(environment) \
		--output-path=$(CURDIR)/../docker_volume/frontend-ng/$(environment)/ \
		--deployUrl=https://sravz-$(environment).s3.amazonaws.com/;npm run gzip \
		--outputdir=$(CURDIR)/../docker_volume/frontend-ng/$(environment)";
	fi

run_in_container: cd-frontend-ng-dir ## Run frondend in a seprate container without the docker compose
	docker run --rm  -e NODE_ENV='vagrant' -v $(CURDIR):/pwd -p 4200:4200 public.ecr.aws/b8h3z2a1/sravz/frontend-ng:$(FRONTEND_NG_IMAGE_Version) bash -c 'cd /pwd; exec "bash"'

build-docker-image:
	docker build --tag public.ecr.aws/b8h3z2a1/sravz/frontend-ng:$(FRONTEND_NG_IMAGE_Version) .

build-docker-image-multiarch:
	docker buildx build --platform linux/amd64,linux/arm64 --tag public.ecr.aws/b8h3z2a1/sravz/frontend-ng:$(FRONTEND_NG_IMAGE_Version) --push .

build-docker-image-bin: cd-frontend-ng-dir
	if [ "staging" == "$(environment)" ]; then \
    	aws s3 sync ../docker_volume/frontend-ng/$(environment)-gzip/ s3://sravz-$(environment)/$(FRONTEND_NG_IMAGE_BIN_Staging_Version)/ --content-encoding='gzip' --exact-timestamps --delete; \
	elif [ "production" == "$(environment)" ]; then \
    	aws s3 sync ../docker_volume/frontend-ng/$(environment)-gzip/ s3://sravz-$(environment)/$(FRONTEND_NG_IMAGE_BIN_Production_Version)/ --content-encoding='gzip' --exact-timestamps --delete; \
	fi
	mkdir -p src/dist
	rm -rf src/dist/*
	cp -r ../docker_volume/frontend-ng/$(environment)/* src/dist
	if [ "staging" == "$(environment)" ]; then \
		docker build -f Dockerfile-ng-app --tag public.ecr.aws/b8h3z2a1/sravz/frontend-ng-$(environment)-bin:$(FRONTEND_NG_IMAGE_BIN_Staging_Version) .; \
	elif [ "production" == "$(environment)" ]; then \
		docker build -f Dockerfile-ng-app --tag public.ecr.aws/b8h3z2a1/sravz/frontend-ng-$(environment)-bin:$(FRONTEND_NG_IMAGE_BIN_Production_Version) .; \
	fi
	rm -rf src/dist

build-docker-image-bin-multiarch: cd-frontend-ng-dir
	if [ "staging" == "$(environment)" ]; then \
    	aws s3 sync ../docker_volume/frontend-ng/$(environment)-gzip/ s3://sravz-$(environment)/$(FRONTEND_NG_IMAGE_BIN_Staging_Version)/ --content-encoding='gzip' --exact-timestamps --delete; \
	elif [ "production" == "$(environment)" ]; then \
    	aws s3 sync ../docker_volume/frontend-ng/$(environment)-gzip/ s3://sravz-$(environment)/$(FRONTEND_NG_IMAGE_BIN_Production_Version)/ --content-encoding='gzip' --exact-timestamps --delete; \
	fi
	mkdir -p src/dist
	rm -rf src/dist/*
	cp -r ../docker_volume/frontend-ng/$(environment)/* src/dist
	if [ "staging" == "$(environment)" ]; then \
		docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile-ng-app --tag public.ecr.aws/b8h3z2a1/sravz/frontend-ng-$(environment)-bin:$(FRONTEND_NG_IMAGE_BIN_Staging_Version) --push .; \
	elif [ "production" == "$(environment)" ]; then \
		docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile-ng-app --tag public.ecr.aws/b8h3z2a1/sravz/frontend-ng-$(environment)-bin:$(FRONTEND_NG_IMAGE_BIN_Production_Version) --push .; \
	fi
	rm -rf src/dist
