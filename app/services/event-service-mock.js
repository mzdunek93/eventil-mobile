let events = [
  {
    id: 1,
    city: 'Paris',
    country: 'France',
    endDate: "2017-04-19T18:39:09Z",
    name: 'PolyConf 17',
    startDate: "2017-04-19T18:39:09Z",
    url: 'https://polyconf.com',
    topics: ['Ruby', 'Python', 'Java'],
    avatar_url: 'https://pbs.twimg.com/profile_images/835588619683393536/hPYowX8r.jpg',
  },
  {
    id: 2,
    city: 'Paris',
    country: 'France',
    endDate: "2017-04-19T18:39:09Z",
    name: 'DotJS 2017',
    startDate: "2017-04-19T18:39:09Z",
    url: 'https://polyconf.com',
    topics: ['Ruby', 'Python', 'JavaScript'],
    avatar_url: 'https://pbs.twimg.com/profile_images/659731659852500993/Ezv9Xe_R.png',
  }
];

export let findAll = () => Promise.resolve(events);


export let findByName = name => {
  let filteredEvents = events.filter(
      _ =>
        (_.name + ' ' + _.topics.join(' '))
          .toLowerCase()
          .indexOf(name.toLowerCase()) > -1
    )
  return Promise.resolve(filteredEvents);
}

export let findById = (id) => {
  let { name, city, country, avatar_url } = events[id-1];

  return Promise.resolve({ name, city, country, avatar_url })
}
