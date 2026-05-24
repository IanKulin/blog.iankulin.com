---
title: "Design Help"
date: '2022-10-03'
slug: design-help
aliases:
  - /2022/10/03/design-help/
tags:
  - design
  - posts
---

<a href="/images/screen-shot-2022-09-29-at-5.50.43-pm-1.png"><img src="/images/screen-shot-2022-09-29-at-5.50.43-pm-1.png" width="253" alt=""></a>

I think I mentioned when I'd completed the [TimesTable app](/times-tables-day-35-challenge/), that I was not happy with the design. It's ugly, I don't like the way the feedback about a wrong answer is shown at the same time as the next question, the number of questions setting would be rarely changed and looks uncomfortable where it is, I'm not sure the purpose of the picker for which times table would be clear, and it's not appealing to children.

I've used [Fiverr](https://www.fiverr.com/search/gigs?query=ux%20design&source=sorting_by&ref_ctx_id=ea3c1ec986bfad92b64b621e1b254729&search_in=everywhere&search-autocomplete-original-term=ux%20design&filter=new) before to have various bits of graphic design done, so I thought I'd have a look, and sure enough there is a heap of people offering UI & UX design. Prices vary widely - from about $10 to $2000AUD. The lower end ones are generally newer entrants. There was a suspicious number of incredibly beautiful looking Ukrainian women wanting UX design gigs - I assumed they were fake and picked a couple of others.

Here's the results so far (one guy is still making changes).

<img src="/images/main-screen-copy.jpg" width="473" alt="">

This one combined the number input with the question text - that's smart. To change the number of questions you click on the circle at the top, then it shows you which question you are up to, plus the circle edge is indicating your progress. I love all of that, but do not like having "Question" written there. There's no solution offered for showing you've got the question correct or wrong, but maybe I could do that in the sum area (with an animated tick, or a crossing out and re-writing). The picker for which table to practice is pretty similar in function. I didn't like the backspace button - but the designer pushed back saying it met the brief of appealing to kids. I love the layered rounded rectangles, and the inset for the question progress. I'm not so keen on having "Times Tables" written at the top, ot the line underneath it. In my version, the title is animated a little to indicated right/wrong answers so perhaps that's why this designer kept it.

<img src="/images/frame-36-copy.png" width="444" alt="">

This designer's first draft was black and white, so apart from moving the backspace (which I like) it was just a less ugly version of my UI. When I asked about how this was appealing to kids, he hit on these colours, which I think are great. The non-centred number of questions is driving me mental, but the designer is currently working on shrinking that somehow and moving it up to the light bulb in the top right. His idea for that was that it would give the user a hint when they clicked on it. That seemed like a change in functionality rather than a UX improvement to me. It turned out he was also a budding mobile developer, so he'd actually built the entire app - I'm not sure if in Flutter or Swift - either way, it looks like I could actually build it with my current skills (although perhaps not that picker). Unlike the first design with the inset and overlapping shapes that's going to require some googling if it's possible at all.

So far, this has been a good experiment. Both designers quickly came up with something much prettier than I had, and although neither of them look perfect to me, now that I've seen them I have ideas to improve them.

Now, the interesting challenge is to see how close I can get to implementing them!
