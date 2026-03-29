FROM debian:sid

RUN apt-get update && \
    apt-get -y install locales && \
    sed -i '/en_US.UTF-8/s/^# //g' '/etc/locale.gen' && \
    locale-gen

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

RUN apt-get -y dist-upgrade && \
    apt-get -y autopurge && \
    apt-get -y install curl git gnupg less man patch ssh vim

COPY --chmod=644 '.vimrc' '/etc/skel'
ARG username='dev'
RUN sed -i '/PS1.*\\\$/s/\\\$/\\n\0/' '/etc/skel/.bashrc' && \
    useradd "${username}" -ms '/bin/bash'

RUN apt-get -y install libatomic1

USER "${username}"

RUN export NODE_VERSION='stable' && \
    curl -L 'https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh' | bash && \
    bash -ic 'npm install --global typescript'

USER root

ARG workspaceFolder
RUN mkdir -p "${workspaceFolder}" && \
    chown -R "${username}:$(id -gn "${username}")" "${workspaceFolder}/.." && \
    ln -s "${workspaceFolder}/host/.vscode" "${workspaceFolder}/.vscode"

USER "${username}"

RUN bash -ic 'npm install --prefix "${workspaceFolder}/.." --save-dev @types/node'
