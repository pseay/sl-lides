const slides = [
  {
    type: 'content',
    title: 'A new section problem - Dominoes!',
    content: (
      <div>
        <p>Preston Seay</p>
        <br></br>
        <h3 className="text-xl mb-4">Presentation Plan</h3>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>The game</li>
          <li>The problem</li>
          <li>The Solution</li>
          <li>Why?</li>
          <li>Bonus???</li>
        </ul>
      </div>
    )
  },

  {
    type: 'content',
    title: 'Mexican Train',
    content: <div className='flex flex-row justify-center' style={{gap: "2em"}}>
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thirtyhandmadedays.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fhow-to-play-mexican-train.jpg&f=1&nofb=1&ipt=66e756a5b42f17129130e00b835741bf1462b1766664521172ab55e6106af619" alt="How to play Mexican Train" width="30%" />
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F3%2F38%2FMexican_Train.jpg%2F660px-Mexican_Train.jpg&f=1&nofb=1&ipt=ad076fa6ee1a071377502a1ca4ebde0894f7b3e87c29f652683bf20c1e9e1d62" alt="Playing Mexican Train" width="30%" />
    </div>
  },

  {
    type: 'content',
    title: 'Mexican Train',
    content: <div className='flex flex-row justify-center' style={{gap: "2em"}}>
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi2.wp.com%2Fwww.glowingeyegames.com%2Fwp-content%2Fuploads%2F2018%2F07%2FMTDC-iPad-shot01.jpeg&f=1&nofb=1&ipt=3c157f620b28feb4fbbc58680501038080c19e93689dcd216af2c2ed4a98be34" alt="The rule for us" width="30%" />
    </div>
  },

  {
    type: 'code',
    title: 'The Domino Class',
    language: 'cpp',
    initialCode:
`// domino.h
class Domino {
public:
    Domino(int left, int right);
    bool canFollow(Domino first) const;
    void flip();
private:
    // We don't care. We'll just use the class.
}`,
  },

  {
    type: 'code',
    title: 'Using the Domino Class',
    language: 'cpp',
    initialCode:
`// demo.cpp
#include "domino.h"
#include <iostream>
using namespace std;

int main() {
    Domino oneTwo(1, 2);
    Domino twoThree(2, 3);
    cout << twoThree.canFollow(oneTwo) << endl;
    cout << oneTwo.canFollow(twoThree) << endl;

    oneTwo.flip();
}`,
  },

  {
    type: "content",
    title: "Our Problem - Finding the longest train",
    content: <>
      <p>Input: A list of dominos.</p>
      <p>Output: The dominos of our longest train, in order.</p>
      <pre lang='cpp'>{`Vector<Domino> calculateLongestTrain(Vector<Domino>& tiles, Domino starter);`}</pre>
    </>
  },

  {
    type: "code",
    title: "The solution",
    language: "cpp",
    initialCode:
`Vector<Domino> calculateLongestTrain(Vector<Domino>& tiles, Domino starter) {
    // Get the longest train here.
}`,
    solution:
`void longTrainHelper(Vector<Domino>& tiles, Vector<Domino> soFar, Vector<Domino>& best) {
    // We've found it!
    if (soFar.size() > best.size) {
      best = soFar;
    }
    
    // Try all possible dominos & rotations.
    for (int i = 0; i < tiles.size(); i++) {
      // Choose tile.
      Domino cur = tiles.remove(i);

      for (int j = 0; j < 2; j++) {
        Domino& end = soFar[soFar.size() - 1];
        if (cur.canFollow(end)) {
          // Explore.
          longTrainHelper(tiles, soFar + cur, best)
        }
        cur.flip();
      }

      // Unchoose tile.
      tiles.insert(cur, i);
    }
}
Vector<Domino> calculateLongestTrain(Vector<Domino>& tiles, Domino starter) {
    Vector<Domino> starterTrain = { starter };
    Vector<Domino> best = { starter };
    longTrainHelper(tiles, starterTrain, best);
    return best;
}`,
  },

  {
    type: "content",
    title: "Why?",
    content: <>
      <p>This was the first recursion problem I solved...</p>
      <p>I solved it in 6th grade...</p>
      <p>But I didn't use recursion...</p>
      <p>I used 15 nested loops.</p>
      <p>106B students should know better!</p>
      <p>BONUS: This will lead well into the Puzzle problem. Very similar with question: "What are all of the options we can consider next?"</p>
    </>
  },

  {
    type: 'whiteboard',
    title: 'Demo',
  },

  {
    type: 'content',
    title: 'Questions?',
    content: <p className="text-2xl">What questions do you have?</p>
  }
];

export default slides;