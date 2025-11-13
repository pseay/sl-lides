const slides = [
  {
    type: 'content',
    title: 'CS 1: Linked-List Insert',
    content: (
      <div>
        <h3 className="text-xl mb-4">Today</h3>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Pointer review</li>
          <li>List-walking pattern</li>
          <li>Insert at arbitrary index</li>
          <li>Live code & test</li>
        </ul>
      </div>
    )
  },

  {
    type: 'content',
    title: 'Node Definition',
    content: (
      <pre className="bg-gray-900 p-4 rounded text-sm">
{`struct StringNode {
    string data;
    StringNode* next;
};`}
      </pre>
    )
  },

  {
    type: 'content',
    title: 'Goal: insert(front, 2, "Jonathan")',
    content: (
      <div className="flex justify-around items-center text-lg">
        <div>
          <p className="mb-2">Before</p>
          <pre className="bg-gray-900 p-3 rounded">
{`"Neel" → "Clinton" → "Yasmine"`}
          </pre>
        </div>
        <span className="text-3xl">➜</span>
        <div>
          <p className="mb-2">After</p>
          <pre className="bg-gray-900 p-3 rounded">
{`"Neel" → "Clinton" → "Jonathan" → "Yasmine"`}
          </pre>
        </div>
      </div>
    )
  },

  {
    type: 'content',
    title: 'Key Rules',
    content: (
      <ul className="list-disc list-inside space-y-3 text-lg">
        <li>Only change pointers – <strong>never</strong> edit existing node data</li>
        <li>No auxiliary containers (arrays, vectors, strings, etc.)</li>
        <li>Index 0 ➜ new front</li>
        <li>Index size ➜ append at tail</li>
      </ul>
    )
  },

  {
    type: 'code',
    title: 'Starter Template',
    language: 'cpp',
    initialCode: `void insert(StringNode*& front, int index, string value) {
    // TODO: your code here
}`,
    description: 'Fill in the body so it satisfies the spec.',
    showOutput: false
  },

  {
    type: 'code',
    title: 'Live Solution',
    language: 'cpp',
    initialCode: `void insert(StringNode*& front, int index, string value) {
    if (index == 0) {
        front = new StringNode{value, front};   // new head
    } else {
        StringNode* curr = front;
        for (int i = 0; i < index - 1; i++)     // stop one before target
            curr = curr->next;
        curr->next = new StringNode{value, curr->next};
    }
}`,
    description: 'Walk through line-by-line with the class.',
    showOutput: false
  },

  {
    type: 'code',
    title: 'Quick Test Driver',
    language: 'cpp',
    initialCode: `int main() {
    StringNode* front = nullptr;
    insert(front, 0, "Yasmine");
    insert(front, 0, "Clinton");
    insert(front, 0, "Neel");
    insert(front, 2, "Jonathan");   // middle
    insert(front, 4, "Zoe");        // tail
    printList(front);               // Neel Clinton Jonathan Yasmine Zoe
    return 0;
}`,
    description: 'Run this to verify correctness live.',
    showOutput: true,
    example: 'Expected output:\nNeel Clinton Jonathan Yasmine Zoe'
  },

  {
    type: 'content',
    title: 'Complexity & Edge-Review',
    content: (
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>Time: O(n) – single walk to (index-1)</li>
        <li>Space: O(1) – only one new node allocated</li>
        <li>Index 0 handled separately to update head pointer</li>
        <li>Loop stops at node <em>before</em> insertion point</li>
      </ul>
    )
  },

  {
    type: 'content',
    title: 'Questions?',
    content: <p className="text-2xl">Ready for Q&A / next exercise!</p>
  }
];

export default slides;