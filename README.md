<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/JONGSKY/Thunder-search-system">
    <img src="https://cdn.icon-icons.com/icons2/317/PNG/512/lightning-icon_34399.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Thunder Search System</h3>

  <p align="center">
    This project is a search system designed to enable patent search and trademark search!
    <br />
    <a href="https://www.notion.so/Thunder-Search-System-9a506f6218484044a12101888d212238"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a00e3328-cba9-4c2c-b251-3afb63a08561/Thunder.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201214T104035Z&X-Amz-Expires=86400&X-Amz-Signature=e1319e4eecdbfde0b97211384bdbf0781af1ddc7fb05b4787e18626271b9c546&X-Amz-SignedHeaders=host">View Web Demo</a>
    ·
    <a href="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bb3cd419-a7d6-442f-9ba7-2fe47acc702c/mobile.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201214T104035Z&X-Amz-Expires=86400&X-Amz-Signature=70ccb0ba1a148bc6b832484e1ee3bfd2e34d4eca1f2e95e7cd752e8f5e286b0e&X-Amz-SignedHeaders=host">View Mobile Demo</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#execution">Execution</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![screenshot](https://user-images.githubusercontent.com/40276516/102075117-1e7d6080-3e49-11eb-80c5-ae58070ec5bc.png)

We have developed a Docker-based search system that enables patent search or trademark search. Text-based patent search implemented a fast search system using ElasticSearch. The trademark search system measures the similarity with the trademarks learned in advance and displays the results.

Patent Search:
* Quickly show search results using ElasticSearch, a distributed open source search and analysis engine.
* It lists words including the spelling of the search term before searching.
* You shouldn't be doing the same tasks over and over like creating a README from scratch
* The Google patent page is linked to the same patent as the patent you searched for. :smile:

Trademark Search:
* Logo Search calculates the similarity between logo images and prints a logo image similar to the target image.
* Logo Search shows the patent number and name of the logo image and connects to the patent page.
* Vienna Search provides tabular words that can describe the logo image.
* Search results provided in tabular format can be saved as csv files.

If you have any inquiries related to the search system, please feel free to contact us. We are confident that the Thunder search system will be useful for doing patent-related searches! :smile: 

### Built With


This section lists the main frameworks, environments, etc. that were used while building the project.
* Code environment
  * [Docker](https://www.docker.com/)
* DataBase
  * [MySQL](https://www.mysql.com/)
  * [Elasticsearch](https://www.elastic.co/kr/elasticsearch/)
  * [Logstash](https://www.elastic.co/kr/logstash)
  * [Adminer](https://www.adminer.org/)
* Web
  * [django](https://www.djangoproject.com/)
  * [Bootstrap](https://getbootstrap.com)
  * [JQuery](https://jquery.com)

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

The configuration environment is the Ubuntu environment, and it is assumed that docker-compose is installed. 
If docker-compose is not installed, refer to the [Official Docker Documentation](https://docs.docker.com/compose/).

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* Check your docker-compose version
  ```sh
  docker-compose --version
  ```


### Installation

1. Download SQL data file and Image data file at [https://download.com](https://download.com)
2. Clone the repo
   ```sh
   git clone https://github.com/JONGSKY/Thunder-search-system.git
   ```
3. Running the docker container
   * Build mysql db
   ```sh
   docker-compose up --build db
   ```
   * Build elasticsearch, logstash, kibana
   ```sh
   docker-compose up --build elasticsearch logstash kibana
   ```
   * Build django web & adminer
   ```sh
   docker-compose up --build web adminer
   ```

4. Check the system built in the local environment 
* If you check `http://localhost:8000/` on the web, you can check the Thunder search system on the web.
* If you check `http://localhost:8080/` on the web, you can check the db on the web.


### Port and Version

|Container|port|version|
|:---|:---:|:---:|
|MySQL|3306|5.7|
|django|8000|3.1.1|
|Elasticsearch|9200|7.6.1|
|Logstash|-|7.6.1|
|kibana|5601|7.6.1|
|adminer|8080|7.6.1|

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://www.notion.so/310f6db5d0f44676bbd6410498450bf0)_


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/JONGSKY/Thunder-search-system/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@Github_teamlab](https://github.com/teamlab) - teamlab.gachon@gmail.com

Project Link: [https://github.com/JONGSKY/Thunder-search-system](https://github.com/JONGSKY/Thunder-search-system)

Project Wikipage: [https://www.notion.so/Thunder-Search-System-9a506f6218484044a12101888d212238](https://www.notion.so/Thunder-Search-System-9a506f6218484044a12101888d212238)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/JONGSKY/Thunder-search-system.svg?style=for-the-badge
[contributors-url]: https://github.com/JONGSKY/Thunder-search-system/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/JONGSKY/Thunder-search-system.svg?style=for-the-badge
[forks-url]: https://github.com/JONGSKY/Thunder-search-system/network/members
[stars-shield]: https://img.shields.io/github/stars/JONGSKY/Thunder-search-system?style=for-the-badge
[stars-url]: https://github.com/JONGSKY/Thunder-search-system/stargazers
[issues-shield]: https://img.shields.io/github/issues/JONGSKY/Thunder-search-system.svg?style=for-the-badge
[issues-url]: https://github.com/JONGSKY/Thunder-search-system/issues
[license-shield]: https://img.shields.io/github/license/JONGSKY/Thunder-search-system.svg?style=for-the-badge
[license-url]: https://github.com/JONGSKY/Thunder-search-system/blob/master/LICENSE.txt