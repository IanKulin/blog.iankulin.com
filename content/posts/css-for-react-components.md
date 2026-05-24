---
title: "CSS for React Components"
date: '2024-01-12'
slug: css-for-react-components
aliases:
  - /2024/01/12/css-for-react-components/
tags:
  - css
  - possibly-useful
  - react
  - styled-components
  - web-dev
  - webdev
---

![](/images/screen-shot-2023-12-27-at-3.30.32-pm.jpg)
*Subscribe to my UX design course 😉*

If you think back to HTML as being a document with headings and paragraphs and other semantic bits, it made a lot of sense to have the styles (expressed as CSS) separate to the document. This allows us to change the styles without touching the document - perhaps the user wanted a dark theme, needed the text bigger for accessibility, or perhaps the document was being consumed in some other way - for example a screen reader - so the styles were superfluous.

In tension to this idea, is the idea that all the code related to a single thing should be encapsulated in one place. This is why we invented object orientated programming - we are creating such huge software systems that for a human to be able to maintain them, they need broken down into chunks that can be fully held in mind while we are working on them. Also, when we are talking about a modern single page application, we've come a long way from thinking of a web 'page' as being a document to be passively consumed.

Since the point of React is to create reusable 'components' where the JS and HTML are written together, it's reasonable to wonder if perhaps the CSS shouldn't be in there too.

Let's look at a few different approaches to managing styles for our components in React.

### Old Style Global

Most times when I'm writing vanilla JS, if I'm not leveraging off [Pico](https://picocss.com/) or [Bootstrap](https://getbootstrap.com/) I have a single site-wide `styles.css` file. Obviously this is going to be an option for a React app too. We'd just link it from the index.html in the root of our folder. Job's a goodun.

<a href="/images/screen-shot-2023-12-27-at-3.27.51-pm.png"><img src="/images/screen-shot-2023-12-27-at-3.27.51-pm.png" width="1000" alt=""></a>

The most common downside of this approach, that I come across, is that I change the rest of the HTML through the various iterations, but never clean up the CSS. So I get left with bits of CSS that I'm not sure if they are being used somewhere - so I'm not brave enough to delete them because my UX testing is not good enough, so those fragments just end up sitting around forever.

### Old Style local

The first CSS we ever wrote was just stuffed in the HTML in style tags, and of course that's still an option. We can use variables to help with the readability, and end up with something like this:

```
function Card(props: CardProps) {    const cardStyles: React.CSSProperties = {    width: '120px',    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',    textAlign: 'center',    backgroundColor: 'cornsilk',    margin: '10px',    padding: '10px',    transform: 'scale(1)',    transition: 'transform 0.3s',  };  const pictureStyles: React.CSSProperties = {    width: '100px',    height: '150px',    margin: 'auto',    borderRadius: '50%',    border: '2px solid #000',  };  const nameStyles: React.CSSProperties = {    color: 'black',    fontSize: '18px',  };  return (    <div style={cardStyles}>      <img        style={pictureStyles}        src={props.image}        alt={props.name}        width={100}      />      <p style={nameStyles}>{props.name}</p>    </div>  );}
```

Initially, this seemed like a good solution, but there's a few bumps involved. The first is that, or course, this is not real CSS. You can see from the type that TypeScript forced me to use (React.CSSProperties) that these are React types that will get turned into CSS at some distant time in the future. Because of this, there are some oddities - my muscle memory wants to type the CSS property names like `box-shadow`, but for this they need to be camel case.

The next issue of 'it's not actually CSS' was when I wanted to do my hover effect for the cards. In CSS this is just:

```
.card:hover {    transform: scale(1.05);    background-color: lightgoldenrodyellow;}
```

If I want to do that with inline styles, I need to capture the MouseEnter and MouseLeave events for the card, then swap the inline styles in and out in code. Ain't nobody got the time for that.

### CSS & Component Libraries

A common and appealing answer to inline styles is to use CSS libraries such as BootStrap, TailWind etc. As well as allowing you to add complex styles into JSX with short memorable tags, they often enforce a design aesthetic without the developer having to put much thought into it. Since I have minimal design skills, that's an appealing option.

Taking this a step further are component are React component libraries such as [chakra](https://chakra-ui.com/), [Material UI](https://mui.com/), and [Ant](https://ant.design/components/overview). With these systems, you get styled components (that can be modified) that follow a unified design - you're not really thinking of CSS but at a high level of abstraction.

### component.css

I guess the default (since it's generated like this in the create-app step) way of managing CSS closer to our components is to have a .CSS file for each component. This overcomes the 'cleaning up' problem described above. If I'm deleting the NavBar component from this project, I can safely eliminate the NavBar.css file at the same time.

The component CSS file is just imported at the top of the component file.

<a href="/images/screen-shot-2023-12-27-at-3.59.14-pm.png"><img src="/images/screen-shot-2023-12-27-at-3.59.14-pm.png" width="1000" alt=""></a>

If you build an app with the CSS in component.css files like this, all the CSS is combined into a single CSS file by the bundler. This raises the possibility of naming conflicts leading the hard to track down problems later. To avoid this I tend to use the component name as a class name and use that to tightly scope the CSS to avoid it bleeding out into other elements.

### Modules

A bit fancier approach is to use CSS modules. This is somewhat similar to the component CSS files described above. Our CSS files have to be renamed to end in `.module.css`, then in the code where you normally insert the class names, you use the class names from the styles library:

```
import styles from "./Card.module.css";// props for cardinterface CardProps {  name: string;  image: string;}function Card(props: CardProps) {  return (    <div className={styles.card}>      <img        className={styles.picture}        src={props.image}        alt={props.name}        width={100}      />      <p className={styles.name}>{props.name}</p>    </div>  );}export default Card;
```

Those class names match the CSS:

```
.card {    width: 120px;    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);    text-align: center;    background-color: cornsilk;    margin: 10px;    padding: 10px;    /* tilt and enlarge on mouseover */    transform: scale(1);    transition: transform 0.3s;}.card:hover {    transform: scale(1.05);    background-color: lightgoldenrodyellow;}.name {    font-size: 18px;    color: black;}.picture {    width: 100px;    height: 150px;    margin: auto;    border-radius: 50%;    border: 2px solid black;}
```

The advantage of using modules, is that you now do _not_ have worry about name clashes. If I build the app and have a look in the generated CSS file, you can see how that works:

```
._card_j2a8o_2 {  width: 120px;  box-shadow: 0 4px 8px #0003;  text-align: center;  background-color: #fff8dc;  margin: 10px;  padding: 10px;  transform: scale(1);  transition: transform 0.3s;}
```

All the generated CSS has unique class names created for it! Presumably these match the ones being used in the JSX, and this explains why you need to use the `styles.` names in your components.

### Styled Components

There are several libraries that tackle the issue of what to do about CSS in React. One of the more popular ones is `Styled Components`. How this works is that you define a base component with some styles in it (with a weird backticky syntax), then build your own components from the styled one. It makes more sense when you see it than my written explanation.

```
import styled from "styled-components";const StyledDiv = styled.div`  width: 120px;  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);  text-align: center;  background-color: cornsilk;  margin: 10px;  padding: 10px;  transform: scale(1);  transition: transform 0.3s;  &:hover {    transform: scale(1.05);    background-color: lightgoldenrodyellow;  }`;const StyledImage = styled.img`  width: 100px;  height: 150px;  margin: auto;  border-radius: 50%;  border: 2px solid black;`;const StyledP = styled.p`  font-size: 18px;  color: black;`;// props for cardinterface CardProps {  name: string;  image: string;}function Card(props: CardProps) {  return (    <StyledDiv className="card">      <StyledImage        className="picture"        src={props.image}        alt={props.name}        width={100}      />      <StyledP className="name">{props.name}</StyledP>    </StyledDiv>  );}export default Card;
```

If you don't mind more dependencies, this is a great solution - I like the clarity of the philosophy of creating styled versions of regular elements as React elements, then using them as the building blocks of our new component. All the CSS attributes you've learned are still there.

The only thing I needed to look up was how to deal with my hover. In the CSS this had been:

```
.card {    width: 120px;    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);    text-align: center;    background-color: cornsilk;    margin: 10px;    padding: 10px;    transform: scale(1);    transition: transform 0.3s;}.card:hover {    transform: scale(1.05);    background-color: lightgoldenrodyellow;}
```

Which had to be translated into this with the & syntax:

```
const StyledDiv = styled.div`  width: 120px;  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);  text-align: center;  background-color: cornsilk;  margin: 10px;  padding: 10px;  transform: scale(1);  transition: transform 0.3s;  &:hover {    transform: scale(1.05);    background-color: lightgoldenrodyellow;  }`;
```

So - lots of options for dealing with CSS in React. I haven't written much, so I'm not sure what my personal preference is. styled-components is definitely the most elegant of the approaches I've looked at here, but I'm a dependency calorie counter so my natural inclination is look elsewhere. The CSS file for each component seems like the next best system - I like that there's no special hooks in the JSX besides the class names I would have used in ordinary HTML, but then you have the risk of name clashes. They can be avoided with the modules - but I am sort of used to dealing with that anyway.
