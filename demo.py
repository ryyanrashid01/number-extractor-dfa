class DFA:
    def __init__(self):
        self.transitions = {
            'start': {'alpha': 'username', 'other': 'reject'},
            'username': {'alpha': 'username', 'digit': 'username', '@': 'domain'},
            'domain': {'alpha': 'domain', '.': 'extension'},
            'extension': {'alpha': 'extension', 'other': 'reject'}
        }
        self.accepting_states = {'extension'}
    
    def transition(self, state, char):
        if char.isalpha():
            return self.transitions[state].get('alpha', 'reject')
        elif char.isdigit():
            return self.transitions[state].get('digit', 'reject')
        else:
            return self.transitions[state].get(char, 'reject')
    
    def is_email(self, text):
        state = 'start'
        for char in text:
            state = self.transition(state, char)
            if state == 'reject':
                return False
        return state in self.accepting_states


def generate_random_text(length):
    import random
    import string
    return ''.join(random.choices(string.ascii_letters + string.digits + '@.', k=length))


if __name__ == "__main__":
    dfa = DFA()
    pattern = "Email Address"
    status = "Rejected"
    while status != "Accepted":
        text = generate_random_text(20)
        status = "Accepted" if dfa.is_email(text) else "Rejected"
        print("Pattern:", pattern)
        print("Text:", text)
        print("Status:", status)
        print("################################################################\n")
