from __future__ import print_function
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets, status
# Create your views here.
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Medicine, Rating
from api.serializers import MedicineSerializer, RatingSerializer, UserSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})


def unique_vals(rows, col):
    return set([row[col] for row in rows])


def class_counts(rows):
    counts = {}  # a dictionary of label -> count.
    for row in rows:
        # in our dataset format, the label is always the last column
        label = row[-1]
        if label not in counts:
            counts[label] = 0
        counts[label] += 1
    return counts


def is_numeric(value):
    return isinstance(value, int) or isinstance(value, float)


class Question:
    def __init__(self, column, value):
        self.column = column
        self.value = value

    def match(self, example):
        val = example[self.column]
        if is_numeric(val):
            return val >= self.value
        else:
            return val == self.value

    def __repr__(self):
        condition = "=="
        if is_numeric(self.value):
            condition = ">="
        return "Is %s %s %s?" % (
            header[self.column], condition, str(self.value))


def partition(rows, question):
    true_rows, false_rows = [], []
    for row in rows:
        if question.match(row):
            true_rows.append(row)
        else:
            false_rows.append(row)
    return true_rows, false_rows


def gini(rows):
    counts = class_counts(rows)
    impurity = 1
    for lbl in counts:
        prob_of_lbl = counts[lbl] / float(len(rows))
        impurity -= prob_of_lbl ** 2
    return impurity


def info_gain(left, right, current_uncertainty):
    p = float(len(left)) / (len(left) + len(right))
    return current_uncertainty - p * gini(left) - (1 - p) * gini(right)


def find_best_split(rows):
    best_gain = 0
    best_question = None
    current_uncertainty = gini(rows)
    n_features = len(rows[0]) - 1

    for col in range(n_features):
        values = set([row[col] for row in rows])
        for val in values:
            question = Question(col, val)
            true_rows, false_rows = partition(rows, question)
            if len(true_rows) == 0 or len(false_rows) == 0:
                continue

            gain = info_gain(true_rows, false_rows, current_uncertainty)
            if gain >= best_gain:
                best_gain, best_question = gain, question
    return best_gain, best_question


class Leaf:

    def __init__(self, rows):
        self.predictions = class_counts(rows)


class Decision_Node:

    def __init__(self,
                 question,
                 true_branch,
                 false_branch):
        self.question = question
        self.true_branch = true_branch
        self.false_branch = false_branch


def build_tree(rows):
    gain, question = find_best_split(rows)

    if gain == 0:
        return Leaf(rows)

    true_rows, false_rows = partition(rows, question)
    true_branch = build_tree(true_rows)
    false_branch = build_tree(false_rows)

    return Decision_Node(question, true_branch, false_branch)


def print_tree(node, spacing=""):
    if isinstance(node, Leaf):
        print(spacing + "Predict", node.predictions)
        return

    print(spacing + str(node.question))
    print(spacing + '--> True:')
    print_tree(node.true_branch, spacing + "  ")
    print(spacing + '--> False:')
    print_tree(node.false_branch, spacing + "  ")


def classify(row, node):
    if isinstance(node, Leaf):
        return node.predictions
    if node.question.match(row):
        return classify(row, node.true_branch)
    else:
        return classify(row, node.false_branch)


def print_leaf(counts):
    total = sum(counts.values()) * 1.0
    probs = {}
    for lbl in counts.keys():
        probs[lbl] = str(int(counts[lbl] / total * 100))
    return probs


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)

    @action(detail=True, methods=['POST'])
    def ptf(self, request, pk=None):
        # print(pk)
        string = ''
        if 'p_t_f' in request.data:
            # ptf = User.objects.get(id=pk)
            user = request.user
            user2 = User.objects.get(id=user.id)
            p_t_f = request.data['p_t_f']
            if user2.p_t_f == "" :
                user2.p_t_f = p_t_f
            else:
                user2.p_t_f += ',' + p_t_f
            print(user2.p_t_f)
            user2.save()
            string += 'p_t_f, '

        if 'email' in request.data:
            user = request.user
            user2 = User.objects.get(id=user.id)
            email = request.data['email']
            user2.email = email
            user2.save()
            string += 'email, '

        if len(request.data) == 0:
            response = {'message': 'nothing was sent'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        response = {'message': string + 'is sent'}
        return Response(response, status=status.HTTP_200_OK)

    training_data = [
        ["fever", 'common', 'Coronavirus'],
        ["fatigue", 'sometimes', 'Coronavirus'],
        ["cough", 'common', 'Coronavirus'],
        ["sneezing", 'no', 'Coronavirus'],
        ["aches_and_pains", 'sometimes', 'Coronavirus'],
        ["runny_or_stuffy_nose", 'rare', 'Coronavirus'],
        ["sore_throat", 'sometimes', 'Coronavirus'],
        ["diarrhoea", 'no', 'Coronavirus'],
        ["headaches", 'rare', 'Coronavirus'],
        ["shortness of breath", 'sometimes', 'Coronavirus'],
        ["fever", 'rare', 'Cold'],
        ["fatigue", 'sometimes', 'Cold'],
        ["cough", 'sometimes', 'Cold'],
        ["sneezing", 'common', 'Cold'],
        ["aches_and_pains", 'common', 'Cold'],
        ["runny _or_stuffy_nose", 'common', 'Cold'],
        ["sore_throat", 'common', 'Cold'],
        ["diarrhoea", 'no', 'Cold'],
        ["headaches", 'rare', 'Cold'],
        ["shortness of breath", 'no', 'Cold'],
        ["fever", 'common', 'Flu'],
        ["fatigue", 'common', 'Flu'],
        ["cough", 'common', 'Flu'],
        ["sneezing", 'no', 'Flu'],
        ["aches_and_pains", 'common', 'Flu'],
        ["runny_or_stuffy_nose", 'rare', 'Flu'],
        ["sore_throat", 'sometimes', 'Flu'],
        ["diarrhoea", 'sometimes', 'Flu'],
        ["headaches", 'common', 'Flu'],
        ["shortness of breath", 'no', 'Flu'],

    ]

    header = ["fever", "fatigue", "cough", "sneezing", "aches_and_pains", "runny_or_stuffy_nose", "sore_throat",
              "diarrhoea", "headaches", "shortness_of_breath", "label"]

    '''testing_data2=[
    [
        "fever",
        "rare",
        ""
    ],
    [
        "fatigue",
        "sometimes",
        ""
    ],
    [
        "cough",
        "mild",
        ""
    ],
    [
        "sneezing",
        "common",
        ""
    ],
    [
        "aches and pains",
        "common",
        ""
    ],
    [
        "runny or stuffy nose",
        "common",
        ""
    ],
    [
        "sore throat",
        "common",
        ""
    ],
    [
        "diarrhoea",
        "no",
        ""
    ],
    [
        "headaches",
        "rare",
        ""
    ],
    [
        "shortness of breath",
        "no",
        ""
    ]
]
'''
    my_tree = build_tree(training_data)
    '''for row in testing_data2:
        print("Predicted:", print_leaf(classify(row, my_tree)))
    dict1={}
    for row in testing_data2:
        a1 = print_leaf(classify(row, my_tree))
        for i in a1:
            a1[i] = int(a1[i])
            if i not in dict1:
                dict1[i] = a1[i]
            if i in dict1:
                if a1[i] > dict1[i]:
                    dict1[i] = a1[i]
    for i in dict1:
        if dict1[i] >= 70:
            print(i,dict1[i])
    '''
    @action(detail=True, methods=['POST'])
    def tree(self, request, pk):
        testing_data = []
        for i in request.data:
            a = []
            a.append(i)
            a.append(request.data[i])
            a.append('')
            testing_data.append(a)

        dict1 = {}
        dict2 = {}
        dict3 = {}
        for row in testing_data:
            a1 = print_leaf(classify(row, self.my_tree))
            for i in a1:
                a1[i] = int(a1[i])
                if i not in dict1:
                    dict1[i] = a1[i]
                    dict2[i] =1
                if i in dict1:
                    dict2[i] += 1
                    if a1[i] == 100:
                        dict1[i] = a1[i]
        for i in dict1:
            if dict1[i] > 50:
                dict3[i] = dict1[i]
        x = 0
        for i in dict2:
            if dict2[i] > x:
                x = dict2[i]

        for i in dict2:
            if dict2[i] == x:
                disease = i
        return Response( disease, status=status.HTTP_200_OK)


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    authentication_classes = (TokenAuthentication,)

    @action(detail=True, methods=['POST'])
    def rate_medicine(self, request, pk=None):
        if 'stars' in request.data:
            medicine = Medicine.objects.get(id=pk)
            stars = request.data['stars']
            user = request.user
            # user = User.objects.get(id=1)
            # print(user)

            try:
                rating = Rating.objects.get(user=user.id, medicine=medicine.id)
                rating.stars = stars
                rating.save()
                serializer = RatingSerializer(rating, many=False)
                response = {'message': 'Rating Updated', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)

            except:
                rating = Rating.objects.create(user=user, medicine=medicine, stars=stars)
                serializer = RatingSerializer(rating, many=False)
                response = {'message': 'Rating Created', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)

        else:
            response = {'message': 'you need to provide stars'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    authentication_classes = (TokenAuthentication,)
