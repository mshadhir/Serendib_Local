export const placesPath = '/places-to-visit-in-sri-lanka';

export const regions = [
  {id:'cultural-triangle', name:'The Cultural Triangle', hint:'Stay near Sigiriya for the rock and cave temples.', image:'/images/sigiriya.webp', alt:'Sigiriya rising above the forest, with the summit ruins in view', caption:'Sigiriya from above', route:'culture-and-tea-country', routeLabel:'7-day culture and tea route'},
  {id:'hill-country', name:'Kandy and the tea hills', hint:'Choose time by the lake, in tea country or on foot in Ella.', image:'/images/hero.webp', alt:'A village below green tea hills in Sri Lanka', caption:'Sri Lankan hill country', route:'island-at-your-pace', routeLabel:'10-day route through the hills'},
  {id:'south-coast', name:'The south coast', hint:'Pair a walk through Galle with a few unhurried nights by the sea.', image:'/images/coast.webp', alt:'Palm trees on Sri Lanka’s south coast', caption:'The southern coast', route:'south-coast-slowly', routeLabel:'5-day south coast route'}
];
const unesco='https://whc.unesco.org/en/list/';
const sara='https://www.dwellingbydesignstudio.com/sigiriya-and-dambulla-sri-lanka/';
const melissa='https://mountainsandmahals.com/top-things-to-do-on-sri-lankas-south-coast/';
export const places = [
  {id:'sigiriya', region:'cultural-triangle', name:'Sigiriya Lion Rock', kind:'Gardens & a climb',
   description:'The gardens at the foot of the rock were part of a royal city. Above them, a stairway leads past two enormous stone lion paws to the ruins on the summit. If heights are not for everyone in your group, make the gardens part of the visit in their own right.',
   official:unesco+'202/', note:'Sara Stubbert found the exposed upper stairs more daunting than the effort of the climb. The breeze on the summit was a welcome surprise after the heat below.', by:'Sara Stubbert', source:sara},
  {id:'dambulla', region:'cultural-triangle', name:'Dambulla Cave Temple', kind:'Buddhist art',
   description:'Five shrines sit inside the rock at Dambulla. Look up as well as ahead: painted figures follow the uneven ceilings above rows of Buddha statues. This is a place of worship, so leave time for the steps and visit at the pace of the people using the temple.',
   official:unesco+'561/', note:'One of the ceilings reminded Sara Stubbert and her companion of draped fabric. It was the painting on the rock that created the effect.', by:'Sara Stubbert', source:sara},
  {id:'kandy', region:'hill-country', name:'Kandy’s Temple of the Tooth', kind:'Living heritage',
   description:'Beside Kandy Lake, the Temple of the Sacred Tooth Relic is an active Buddhist pilgrimage site. A visit here pairs well with a walk along the lakeshore. If you hope to attend a ceremony, check the temple’s arrangements for your day.',
   official:unesco+'450/', note:'Peter Gifford remembers the sound of drums on his early visit. While he waited, another worshipper shared flowers for him to offer at the shrine.', by:'Peter Gifford', source:'https://www.petergifford.com/sri-lanka/kandy/'},
  {id:'nuwara-eliya', region:'hill-country', name:'Nuwara Eliya', kind:'Tea country',
   description:'Tea-covered slopes give way to a highland town with an old post office and room for a walk beside Gregory Lake. Decide whether you want to linger in town or visit a tea estate; estate entry and factory visits are confirmed separately.',
   note:'On a recommendation from their homestay host, the travellers behind 2 Nerdy Nomads visited a Damro estate for tea tasting. They suggest leaving two nights if you like a slower pace.', by:'2 Nerdy Nomads', source:'https://2nerdynomads.com/blog/road-trip-in-sri-lanka-itinerary-2-weeks'},
  {id:'ella', region:'hill-country', name:'Nine Arch Bridge, Ella', kind:'Railway viewpoints',
   description:'The railway curves across a wooded valley outside Ella on nine stone arches. Head for a viewpoint off the tracks to see the full curve. The bridge makes a good stop even when there is no train in sight.',
   note:'The Manduls found a favourite photo angle on the forest approach, before reaching the bridge. They waited around half an hour for a train and enjoyed the quiet in the meantime.', by:'The Manduls', source:'https://themanduls.com/nine-arch-bridge-ella/'},
  {id:'galle', region:'south-coast', name:'Galle Fort', kind:'Old town on foot',
   description:'Galle’s old town is tucked inside a wall overlooking the Indian Ocean. Walk along the ramparts, then turn inland for lanes of houses, shops and cafés. Agree on a pickup point so you can explore the fort on foot.',
   official:unesco+'451/', note:'Melissa Kruse walked the walls at sunset on two successive evenings. On the second walk there were still corners she hadn’t noticed the first time.', by:'Melissa Kruse', source:melissa},
  {id:'mirissa', region:'south-coast', name:'Mirissa Beach', kind:'Time by the sea',
   description:'Mirissa’s sandy bay makes an easy change of pace after a few days on the road. Leave an evening free to walk the shore instead of making a boat trip the centre of your stay.',
   official:'https://www.srilanka.travel/attraction?attraction_id=165', note:'Melissa Kruse had planned a week in Sri Lanka. While in Mirissa she added a second week because she wanted more time on the southern beaches.', by:'Melissa Kruse', source:melissa}
];
