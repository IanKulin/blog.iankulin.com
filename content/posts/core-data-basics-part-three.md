---
title: "Core Data basics – Part Three"
date: '2022-11-24'
slug: core-data-basics-part-three
aliases:
  - /2022/11/24/core-data-basics-part-three/
tags:
  - coredata
  - swift5-7
  - xcode14-1
---

If you're just stumbling across this, perhaps have a look at Part 1 where I layout a simple master/detail app with the data held as arrays of structs, and Part 2 where I convert that into the simplest possible Core Data version. In this post, I'm going to add the mechanics for the one:many relationship - Each Garden can be associated with multiple Plants.

I should also mention I figured out some of this with help from [this video](https://www.youtube.com/watch?v=xgPlJXTfiNA) from [Jonathan Rasmusson](https://www.youtube.com/channel/UCxnCA5FBYRCFgIZWD0CKCVg/about).

![](/images/screen-shot-2022-11-21-at-6.41.46-am.png)

First step is another Paul hack. If you look in the `Garden+CoreDataProperties.swift` file where the Garden properties are defined, you'll see that the `plants` variable has the type `?NSSet` which is not straightforward to work with. We'd prefer it to be an array of Plant so we can easily turn it into a list in SwiftUI ways.

```
extension Garden {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<Garden> {
        return NSFetchRequest<Garden>(entityName: "Garden")
    }

    @NSManaged public var address: String?
    @NSManaged public var id: UUID?
    @NSManaged public var name: String?
    @NSManaged public var plant: NSSet?
    
    var wrappedName: String {
        name ?? "Unknown"
    }
    var wrappedAddress: String {
        address ?? "Unknown"
    }
    
    var plantArray: [Plant] {
        let set = plant as? Set<Plant> ?? []
        return set.sorted {
            $0.wrappedName < $1.wrappedName
        }
    }

}
```

Using a computed variable (in this case plantArray), Paul likes to turn it into a Set of Plants, then convert that into an array by sorting it. We have to provide the predicate, but it's a small price to pay to get the array back. I have concerns about this for a 100K array, but it's no problem for this app.

Back in our Garden DetailView, it's now a simple matter to show the plants for a garden in a list under the other garden details.

```
struct DetailView: View {
    var garden: Garden
    
    var body: some View {
        VStack {
            Text(garden.wrappedName)
                .font(.headline)
            Text(garden.wrappedAddress)
            List {
                ForEach(garden.plantArray, id: \.self) {plant in
                    Text(plant.wrappedName)
                }
            }
        }
    }
}
```

Finally, in the button press to create our sample data, we need to create each of the plant instances then call a method on a garden to add them to that garden.

```
Button("Sample Data") {
    let garden1 = Garden(context: moc)
    garden1.id = UUID()
    garden1.name = "White Lodge"
    garden1.address = "72 Anderson Street \nRothwell QLD 4022"
    
    let plant1 = Plant(context: moc)
    plant1.name = "Rose"
    garden1.addToPlant(plant1)
    let plant2 = Plant(context: moc)
    plant2.name = "Palm Tree"
    plant2.garden? = garden1
    garden1.addToPlant(plant2)
    let plant3 = Plant(context: moc)
    plant3.name = "Lawn"
    plant3.garden? = garden1
    garden1.addToPlant(plant3)
```

The .addToPlant() accessor method is a Swift wrapper for some internal Objective C that was generated for us in the same file as the Garden properties. The bad name 'AddToPlant' rather than 'AddToPlants' is my bad. When I defined the relationship in Garden (in the data model) I should have called it 'plants'.

[Part 1](/core-data-basics-part-one/), [Part 2](/core-data-basics-part-two/)
