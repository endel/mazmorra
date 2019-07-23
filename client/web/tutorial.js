import { isMobile } from "../utils/device";
import { PlayerPrefs } from "../core/PlayerPrefs";

export function isTutorialComplete() {
  return isMobile || PlayerPrefs.get("tutorial", false) || false;
}

export function showTutorial() {
  const div = document.createElement("div");
  div.id = "tutorial";
  div.classList.add("modal");
  div.classList.add("active");

  let currentStep = 1;
  div.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  })

  div.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const contents = div.querySelector(".contents");
    const pages = div.querySelector("span.pages");

    if (e.target.classList.contains("last")) {
      document.body.removeChild(div);
      PlayerPrefs.set("tutorial", true, false);

    } else if (e.target.classList.contains("right")) {
      contents.classList.remove(`step-${currentStep}`);
      currentStep++;
      contents.classList.add(`step-${currentStep}`);

    } else if (e.target.classList.contains("left")) {
      contents.classList.remove(`step-${currentStep}`);
      currentStep--;
      contents.classList.add(`step-${currentStep}`);
    }

    pages.innerHTML = `${currentStep}/9`;
  });

  div.innerHTML = `
  <h2>How to play (<span class="pages">1/9</span>)</h2>
  <div class="contents step-1">
    <a class="nav left" href="#">« Previous</a>
    <a class="nav right" href="#">Next »</a>
    <a class="nav last" href="#">Play!</a>

    <div class="step-1">
      <p>Left click or touch to move</p>
      <img src="images/tutorial/move.png" alt="How to move" />
    </div>

    <div class="step-2">
      <p>Chests can give you potions, gold, and items to equip</p>
      <img src="images/tutorial/chests.png" alt="Opening chests" />
    </div>

    <div class="step-3">
      <p>Right click on enemies to attack them</p>
      <img src="images/tutorial/enemies.png" alt="Killing enemies" />
    </div>

    <div class="step-4">
      <p>When you level up, you can increase your hero's stats</p>
      <img src="images/tutorial/level-up-1.png" alt="Level up button" />
    </div>

    <div class="step-5">
      <p>Choose wisely which stat to increase</p>
      <img src="images/tutorial/level-up-2.png" alt="Level up button" />
    </div>

    <div class="step-6">
      <p>Click on the bag, or press "I" or "B" to open inventory</p>
      <img src="images/tutorial/inventory-1.png" alt="Inventory: Toggle" />
    </div>

    <div class="step-7">
      <p>Consume, equip or trade items from the bag</p>
      <img src="images/tutorial/inventory-2.png" alt="Inventory: Bag" />
    </div>

    <div class="step-8">
      <p>Equipped items can increase your stats, and improve your hero</p>
      <img src="images/tutorial/inventory-3.png" alt="Inventory: Equipped Items" />
    </div>

    <div class="step-9">
      <p>Use number keys (1, 2, 3) to consume HP/MP/Scrolls</p>
      <img src="images/tutorial/inventory-4.png" alt="Inventory: Quick access" />
    </div>

  </div>
`;

  document.body.appendChild(div);
}
