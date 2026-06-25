import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    icon: "😀",
    emojis: [
      { char: "😀", name: "grinning face smiley happy" },
      { char: "😃", name: "grinning face big eyes smiley happy" },
      { char: "😄", name: "grinning face smiling eyes happy laugh" },
      { char: "😁", name: "beaming face smiling eyes grin happy" },
      { char: "😆", name: "grinning squinting face laugh" },
      { char: "😅", name: "grinning face sweat laugh nervous" },
      { char: "😂", name: "face tears of joy laugh funny lol" },
      { char: "🤣", name: "rolling on the floor laughing rofl" },
      { char: "😊", name: "smiling face smiling eyes happy blush" },
      { char: "😇", name: "smiling face halo angel innocent" },
      { char: "🙂", name: "slightly smiling face" },
      { char: "🙃", name: "upside down face silly" },
      { char: "😉", name: "winking face wink" },
      { char: "😌", name: "relieved face content calm" },
      { char: "😍", name: "smiling face heart eyes love" },
      { char: "🥰", name: "smiling face hearts love warm" },
      { char: "😘", name: "face blowing kiss love mwah" },
      { char: "😗", name: "kissing face" },
      { char: "😙", name: "kissing face smiling eyes" },
      { char: "😚", name: "kissing face closed eyes" },
      { char: "😋", name: "face savoring food delicious tasty yum" },
      { char: "😛", name: "face tongue silly" },
      { char: "😝", name: "squinting face tongue silly" },
      { char: "😜", name: "winking face tongue wink silly" },
      { char: "🤪", name: "zany face crazy silly" },
      { char: "🤨", name: "face raised eyebrow suspect skeptical" },
      { char: "🧐", name: "face monocle inspector detective" },
      { char: "🤓", name: "nerd face geek smart" },
      { char: "😎", name: "smiling face sunglasses cool chill" },
      { char: "🥸", name: "disguised face mask" },
      { char: "🤩", name: "star struck excited wowed" },
      { char: "🥳", name: "partying face celebrate party" },
      { char: "😏", name: "smirking face smirk sly" },
      { char: "😒", name: "unamused face annoyed bored" },
      { char: "😞", name: "disappointed face sad" },
      { char: "😔", name: "pensive face sad thoughtful" },
      { char: "😟", name: "worried face concern" },
      { char: "😕", name: "confused face unsure" },
      { char: "🙁", name: "slightly frowning face" },
      { char: "☹️", name: "frowning face sad" },
      { char: "😣", name: "persevering face struggle" },
      { char: "😖", name: "confounded face frustrated" },
      { char: "😫", name: "tired face exhausted" },
      { char: "😩", name: "weary face tired" },
      { char: "🥺", name: "pleading face beg puppy eyes" },
      { char: "😢", name: "crying face sad tear" },
      { char: "😭", name: "loudly crying face sob sad tears" },
      { char: "😤", name: "face steam nose angry mad win" },
      { char: "😠", name: "angry face mad" },
      { char: "😡", name: "pouting face angry mad furious" },
      { char: "🤬", name: "face symbols mouth cursing angry swearing" },
      { char: "🤯", name: "exploding head mind blown wow" },
      { char: "😳", name: "flushed face embarrassed shocked" },
      { char: "🥵", name: "hot face overheat summer sun" },
      { char: "🥶", name: "cold face freeze winter ice" },
      { char: "😱", name: "face screaming fear scared shock" },
      { char: "😨", name: "fearful face scared" },
      { char: "😰", name: "anxious face sweat concern" },
      { char: "😥", name: "sad relieved face sweat" },
      { char: "😓", name: "downcast face sweat sad tired" },
      { char: "🤗", name: "hugging face hug friendly" },
      { char: "🤔", name: "thinking face hmmm" },
      { char: "🤭", name: "face hand mouth giggle oops" },
      { char: "🤫", name: "shushing face quiet silence ssh" },
      { char: "🤥", name: "lying face pinocchio liar nose" },
      { char: "😶", name: "face no mouth silent" },
      { char: "😐", name: "neutral face meh ok" },
      { char: "😑", name: "expressionless face meh flat" },
      { char: "😬", name: "grimacing face awkward cringe" },
      { char: "🙄", name: "face rolling eyes annoyed whatever" },
      { char: "😯", name: "hushed face surprised" },
      { char: "😦", name: "frowning face open mouth concern" },
      { char: "😧", name: "anguished face shock" },
      { char: "😮", name: "face open mouth surprise wow" },
      { char: "😲", name: "astonished face shocked amazed" },
      { char: "🥱", name: "yawning face tired sleep" },
      { char: "😴", name: "sleeping face zzz sleep snore" },
      { char: "🤤", name: "drooling face sleep delicious" },
      { char: "😪", name: "sleepy face tired tear" },
      { char: "😵", name: "knocked out face dizzy dead" },
      { char: "🤐", name: "zipper mouth face secret zip" },
      { char: "🥴", name: "woozy face drunk tipsy dizzy" },
      { char: "🤢", name: "nauseated face sick green disgust" },
      { char: "🤮", name: "face vomiting sick throw up" },
      { char: "🤧", name: "sneezing face sick sneeze" },
      { char: "😷", name: "medical mask face sick doctor health" },
      { char: "🤒", name: "face thermometer sick fever temperature" },
      { char: "🤕", name: "face bandage sick hurt injury" }
    ]
  },
  {
    name: "Gestures",
    icon: "👍",
    emojis: [
      { char: "👍", name: "thumbs up approve like yes" },
      { char: "👎", name: "thumbs down disapprove dislike no" },
      { char: "👌", name: "ok hand okay correct good" },
      { char: "🤌", name: "pinched fingers Italian gesture" },
      { char: "🤏", name: "pinched hand small tiny bit" },
      { char: "✌️", name: "victory hand peace sign" },
      { char: "🤞", name: "crossed fingers luck hope" },
      { char: "🤟", name: "love you gesture hand" },
      { char: "🤘", name: "sign of the horns rock on metal" },
      { char: "🤙", name: "call me hand phone" },
      { char: "👈", name: "pointing left" },
      { char: "👉", name: "pointing right" },
      { char: "👆", name: "pointing up" },
      { char: "🖕", name: "middle finger" },
      { char: "👇", name: "pointing down" },
      { char: "☝️", name: "index pointing up attention" },
      { char: "✊", name: "raised fist power" },
      { char: "👊", name: "oncoming fist punch brofist" },
      { char: "🤛", name: "left facing fist" },
      { char: "🤜", name: "right facing fist" },
      { char: "👏", name: "clapping hands clap bravo congrats" },
      { char: "🙌", name: "raising hands celebrate hooray" },
      { char: "👐", name: "open hands hug" },
      { char: "🤲", name: "palms up together pray book" },
      { char: "🤝", name: "handshake agreement deal shake" },
      { char: "🙏", name: "folded hands pray please thank you namaste" },
      { char: "✍️", name: "writing hand write pen" },
      { char: "💅", name: "nail polish manicure salon beauty style" },
      { char: "🤳", name: "selfie photo camera phone" },
      { char: "💪", name: "flexed biceps strength strong muscle power" },
      { char: "👀", name: "eyes look see watching" },
      { char: "🧠", name: "brain mind think intelligence" }
    ]
  },
  {
    name: "Hearts",
    icon: "❤️",
    emojis: [
      { char: "❤️", name: "red heart love romance" },
      { char: "🧡", name: "orange heart love" },
      { char: "💛", name: "yellow heart love friendship" },
      { char: "💚", name: "green heart love nature" },
      { char: "💙", name: "blue heart love trust" },
      { char: "💜", name: "purple heart love royalty" },
      { char: "🖤", name: "black heart love emo dark" },
      { char: "🤍", name: "white heart love peace" },
      { char: "🤎", name: "brown heart love chocolate" },
      { char: "💔", name: "broken heart heartbreak sad break" },
      { char: "❤️‍🔥", name: "heart on fire burning passionate love" },
      { char: "❤️‍🩹", name: "mending heart healing recovery" },
      { char: "❣️", name: "heart exclamation mark punctuation" },
      { char: "💕", name: "two hearts love side" },
      { char: "💞", name: "revolving hearts love orbit" },
      { char: "💓", name: "beating heart love pulse" },
      { char: "💗", name: "growing heart love scale" },
      { char: "💖", name: "sparkling heart love shiny" },
      { char: "💘", name: "heart arrow cupid love" },
      { char: "💝", name: "heart ribbon gift present" },
      { char: "💟", name: "heart decoration square" }
    ]
  },
  {
    name: "Animals",
    icon: "🐱",
    emojis: [
      { char: "🐶", name: "dog face puppy pet animal barking" },
      { char: "🐱", name: "cat face kitten pet animal meow" },
      { char: "🐭", name: "mouse face rodent animal squeak" },
      { char: "🐹", name: "hamster face pet animal cute" },
      { char: "🐰", name: "rabbit face bunny pet animal hop" },
      { char: "🦊", name: "fox face wild animal clever" },
      { char: "🐻", name: "bear face wild animal" },
      { char: "🐼", name: "panda face animal cute" },
      { char: "🐨", name: "koala animal cute" },
      { char: "🐯", name: "tiger face wild animal roar cat" },
      { char: "🦁", name: "lion face wild animal roar cat power" },
      { char: "🐮", name: "cow face farm animal milk" },
      { char: "🐷", name: "pig face farm animal oink" },
      { char: "🐽", name: "pig nose snout" },
      { char: "🐸", name: "frog face amphibian animal jump ribbit" },
      { char: "🐵", name: "monkey face animal chimpanzee" },
      { char: "🙈", name: "see no evil monkey blind ignore" },
      { char: "🙉", name: "hear no evil monkey deaf listen" },
      { char: "🙊", name: "speak no evil monkey mute quiet" },
      { char: "🐒", name: "monkey animal" },
      { char: "🐔", name: "chicken farm bird cluck" },
      { char: "🐧", name: "penguin bird ice water" },
      { char: "🐦", name: "bird fly tweet" },
      { char: "🐤", name: "baby chick bird" },
      { char: "🐣", name: "hatching chick egg bird" },
      { char: "🐥", name: "front-facing baby chick bird" },
      { char: "🦆", name: "duck bird pond quack" },
      { char: "🦅", name: "eagle bird prey fly power" },
      { char: "🦉", name: "owl bird night wisdom" },
      { char: "🦇", name: "bat animal fly night vampire" },
      { char: "🐺", name: "wolf wild animal howl dog" },
      { char: "🐴", name: "horse face animal run" },
      { char: "🦄", name: "unicorn face magic fantasy horse" },
      { char: "🐝", name: "honeybee bee insect honey sting" },
      { char: "🦋", name: "butterfly insect wings beautiful" },
      { char: "🐌", name: "snail insect slow shell" },
      { char: "🐞", name: "lady beetle bug ladybug" },
      { char: "🐜", name: "ant insect tiny" },
      { char: "🕷️", name: "spider bug insect crawl" },
      { char: "🕸️", name: "spider web cobweb" },
      { char: "🦂", name: "scorpion bug sting poison" },
      { char: "🐢", name: "turtle animal reptile slow shell" },
      { char: "🐍", name: "snake reptile hiss poison" },
      { char: "🐙", name: "octopus sea animal tentacles" },
      { char: "🦑", name: "squid sea animal tentacle" },
      { char: "🦞", name: "lobster sea animal red claws" },
      { char: "🦀", name: "crab sea animal claws pinch" },
      { char: "🐠", name: "tropical fish sea animal colorful" },
      { char: "🐟", name: "fish sea animal water swimming" },
      { char: "🐬", name: "dolphin sea animal smart swimming" },
      { char: "🐳", name: "spouting whale sea animal big water" },
      { char: "🐋", name: "whale sea animal swimming" },
      { char: "🦈", name: "shark sea animal predator teeth" },
      { char: "🐊", name: "crocodile reptile wild animal teeth swamp" },
      { char: "🐆", name: "leopard wild animal cat speed" },
      { char: "🦓", name: "zebra animal stripes wild" },
      { char: "🦍", name: "gorilla wild animal strong monkey" },
      { char: "🐘", name: "elephant wild animal big trunk" }
    ]
  },
  {
    name: "Food",
    icon: "🍕",
    emojis: [
      { char: "🍏", name: "green apple fruit food healthy" },
      { char: "🍎", name: "red apple fruit food healthy" },
      { char: "🍐", name: "pear fruit food healthy" },
      { char: "🍊", name: "tangerine orange fruit food citrus" },
      { char: "🍋", name: "lemon fruit food citrus yellow" },
      { char: "🍌", name: "banana fruit food yellow sweet" },
      { char: "🍉", name: "watermelon fruit food summer sweet" },
      { char: "🍇", name: "grapes fruit food sweet" },
      { char: "🍓", name: "strawberry fruit food red berry sweet" },
      { char: "🍒", name: "cherries fruit food red sweet" },
      { char: "🍑", name: "peach fruit food sweet" },
      { char: "🥭", name: "mango fruit food tropical yellow sweet" },
      { char: "🍍", name: "pineapple fruit food tropical sweet" },
      { char: "🥥", name: "coconut fruit food tropical nut" },
      { char: "🥝", name: "kiwi fruit food green" },
      { char: "🍅", name: "tomato vegetable food red salad" },
      { char: "🍆", name: "eggplant agriculture food" },
      { char: "🥑", name: "avocado fruit food green healthy guacamole" },
      { char: "🥦", name: "broccoli vegetable food green healthy" },
      { char: "🥬", name: "leafy green vegetable lettuce salad food" },
      { char: "🥒", name: "cucumber vegetable food pickle green" },
      { char: "🌶️", name: "hot pepper chili spicy red hot food" },
      { char: "🌽", name: "ear of corn food yellow sweet vegetable" },
      { char: "🥔", name: "potato food carb root vegetable" },
      { char: "🥐", name: "croissant bread pastry bakery breakfast food" },
      { char: "🥯", name: "bagel bread pastry bakery breakfast food" },
      { char: "🍞", name: "bread loaf bakery toast carb food" },
      { char: "🧀", name: "cheese wedge yellow dairy food" },
      { char: "🍳", name: "cooking egg fry pan breakfast food" },
      { char: "🥞", name: "pancakes breakfast maple syrup sweet food" },
      { char: "🧇", name: "waffle breakfast maple syrup sweet food" },
      { char: "🥓", name: "bacon meat pork breakfast salty food" },
      { char: "🥩", name: "cut of meat steak beef grill food" },
      { char: "🍗", name: "poultry leg chicken drumstick meat food" },
      { char: "🍔", name: "hamburger burger fast food meat cheese" },
      { char: "🍟", name: "french fries potato chips fast food salty" },
      { char: "🍕", name: "pizza slice cheese Italian fast food" },
      { char: "🥪", name: "sandwich bread lunch food" },
      { char: "🌮", name: "taco Mexican fast food spicy" },
      { char: "🌯", name: "burrito Mexican wrap fast food" },
      { char: "🥗", name: "green salad healthy vegetable lettuce food" },
      { char: "🍿", name: "popcorn movie theater snack salty food" },
      { char: "🍩", name: "donut doughnut sweet bakery dessert glaze" },
      { char: "🍪", name: "cookie chocolate chip sweet bakery dessert" },
      { char: "🎂", name: "birthday cake celebrate sweet dessert" },
      { char: "🍰", name: "shortcake slice cake sweet dessert" },
      { char: "🧁", name: "cupcake sweet dessert bakery" },
      { char: "🥧", name: "pie slice sweet dessert bakery" },
      { char: "🍫", name: "chocolate bar candy sweet dessert cacao" },
      { char: "🍬", name: "candy sweet sugar dessert" },
      { char: "🍭", name: "lollipop candy sweet sugar dessert" },
      { char: "🍮", name: "custard sweet dessert" },
      { char: "🍯", name: "honey pot sweet bee" },
      { char: "🥛", name: "glass of milk dairy drink" },
      { char: "☕", name: "hot beverage coffee tea mug cafe cup drink" },
      { char: "🍵", name: "teacup without handle green tea drink" },
      { char: "🍺", name: "beer mug alcohol pub drink" },
      { char: "🍻", name: "clinking beer mugs alcohol cheers pub party drink" },
      { char: "🥂", name: "clinking glasses champagne toast celebrate drink" },
      { char: "🥃", name: "tumbler glass whiskey alcohol drink" },
      { char: "🥤", name: "cup with straw soda drink soft" }
    ]
  },
  {
    name: "Travel",
    icon: "✈️",
    emojis: [
      { char: "⚽", name: "soccer ball sports play game" },
      { char: "🏀", name: "basketball sports play game" },
      { char: "🏈", name: "american football sports play game" },
      { char: "🎾", name: "tennis ball sports play game" },
      { char: "🏐", name: "volleyball sports play game" },
      { char: "🎮", name: "video game controller gaming play" },
      { char: "✈️", name: "airplane flight travel fly vacation airport" },
      { char: "🚀", name: "rocket space travel fly speed" },
      { char: "🛸", name: "flying saucer ufo space alien mystery" },
      { char: "🚗", name: "red car drive vehicle transport travel" },
      { char: "🚨", name: "police car light siren emergency warning red blue" },
      { char: "🔥", name: "fire flame hot burn lit trend" },
      { char: "✨", name: "sparkles shiny magic clean new" },
      { char: "🎉", name: "party popper celebrate party congrats birthday" },
      { char: "🎈", name: "balloon celebrate party birthday" },
      { char: "💡", name: "light bulb idea creative electricity" },
      { char: "💻", name: "laptop computer tech screen work" },
      { char: "📱", name: "mobile phone smartphone tech screen call text" },
      { char: "📷", name: "camera photo picture photography" },
      { char: "📚", name: "books read study school learning library" },
      { char: "💸", name: "money with wings cash spend wealth buy" },
      { char: "💵", name: "dollar banknote money cash currency" },
      { char: "🔒", name: "locked lock security privacy safe" },
      { char: "🔓", name: "unlocked open lock security" },
      { char: "🔑", name: "key unlock open security access" }
    ]
  }
];

const EmojiPicker = ({ onSelect, onClose, triggerRef }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(EMOJI_CATEGORIES[0].name);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        (!triggerRef?.current || !triggerRef.current.contains(event.target))
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, triggerRef]);

  // filter emojis
  const searchResults = [];
  if (searchTerm) {
    const query = searchTerm.toLowerCase().trim();
    EMOJI_CATEGORIES.forEach((category) => {
      category.emojis.forEach((item) => {
        if (item.name.toLowerCase().includes(query)) {
          searchResults.push(item);
        }
      });
    });
  }

  const currentCategory = EMOJI_CATEGORIES.find((cat) => cat.name === activeTab);
  const displayedEmojis = searchTerm ? searchResults : currentCategory ? currentCategory.emojis : [];

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-20 left-4 z-40 w-80 h-96 bg-base-100/95 backdrop-blur-md border border-base-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-4"
    >
      {/* Header Search */}
      <div className="p-3 border-b border-base-300 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 bg-base-200/50 focus:outline-none focus:border-primary text-sm rounded-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Categories Selector Tabs (only shown when not searching) */}
      {!searchTerm && (
        <div className="flex justify-around bg-base-200/30 border-b border-base-300 py-1.5 px-1 shrink-0">
          {EMOJI_CATEGORIES.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => setActiveTab(category.name)}
              className={`p-1.5 rounded-lg text-lg transition-all hover:bg-base-200/80 active:scale-95 ${
                activeTab === category.name
                  ? "bg-primary/10 text-primary scale-110"
                  : "opacity-60 hover:opacity-100"
              }`}
              title={category.name}
            >
              {category.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emojis Grid */}
      <div className="flex-1 overflow-y-auto p-3.5 scrollbar-thin scrollbar-thumb-base-300">
        {displayedEmojis.length > 0 ? (
          <div className="grid grid-cols-8 gap-1.5 content-start">
            {displayedEmojis.map((item, idx) => (
              <button
                key={`${item.char}-${idx}`}
                type="button"
                onClick={() => onSelect(item.char)}
                onMouseEnter={() => setHoveredEmoji(item)}
                onMouseLeave={() => setHoveredEmoji(null)}
                className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-base-200 hover:scale-125 transition-all duration-100 ease-out select-none active:scale-95"
              >
                {item.char}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50 text-sm py-8">
            <span className="text-3xl mb-2">🔍</span>
            No emojis found
          </div>
        )}
      </div>

      {/* Footer Info Display */}
      <div className="h-9 px-3 border-t border-base-300 bg-base-200/30 flex items-center justify-between text-xs text-base-content/50 shrink-0 select-none">
        <span>
          {hoveredEmoji ? `:${hoveredEmoji.name.split(" ")[0]}:` : searchTerm ? "Search results" : activeTab}
        </span>
        {hoveredEmoji && <span className="text-lg">{hoveredEmoji.char}</span>}
      </div>
    </div>
  );
};

export default EmojiPicker;
