from . import verbal, numerical, analytical, clerical, general

def get_all_categories():
    return {
        'verbal': verbal.get_verbal_questions,
        'numerical': numerical.get_numerical_questions,
        'analytical': analytical.get_analytical_questions,
        'clerical': clerical.get_clerical_questions,
        'general': general.get_general_questions,
    }
