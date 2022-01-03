import saveToCsv from '../lib/saveToCsv'

test('save an object to csv', async () => {
    const objectToSave = [
        {'1': 'a', '2': 'b', '3': 'c'},
        {'1': 'a', '2': 'b', '3': 'c'},
        {'1': 'a', '2': 'b', '3': 'c'},
        {'1': 'a', '2': 'b', '3': 'c'},
        {'1': 'a', '2': 'b', '3': 'c'},
        {'1': 'a', '2': 'b', '3': 'c'},
    ]

    saveToCsv(objectToSave, 'test.csv')
  });  